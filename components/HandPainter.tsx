"use client";

import { useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

type TrailSegment = {
  from: Point;
  to: Point;
  createdAt: number;
  hue: number;
};

type Landmark = {
  x: number;
  y: number;
  z: number;
};

type HandsResults = {
  multiHandLandmarks?: Landmark[][];
};

type ScrollState = {
  active: boolean;
  lostFrames: number;
  scrollVelocity: number;
  lastPinchCenter: Point | null;
};

declare global {
  interface Window {
    Camera?: new (
      video: HTMLVideoElement,
      options: { onFrame: () => Promise<void>; width: number; height: number }
    ) => { start: () => Promise<void>; stop?: () => void };
    Hands?: new (config: { locateFile: (file: string) => string }) => {
      setOptions: (options: Record<string, number | boolean>) => void;
      onResults: (callback: (results: HandsResults) => void) => void;
      send: (input: { image: HTMLVideoElement }) => Promise<void>;
      close?: () => Promise<void>;
    };
  }
}

const SCRIPT_URLS = [
  "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
  "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
];

const MAX_SEGMENT_AGE = 3000;
const PINCH_CENTER_SMOOTHING = 0.12;
const SCROLL_TRIGGER_DELTA = 1.6;
const SCROLL_FIXED_STEP = 112;
const SCROLL_DEADZONE = 3;
const SCROLL_LOST_FRAMES = 18;
const PINCH_ENTER_SPREAD = 0.07;
const PINCH_EXIT_SPREAD = 0.095;
const HAND_CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
];

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-mediapipe-src="${src}"]`
    );

    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.mediapipeSrc = src;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function projectLandmark(landmark: Landmark, width: number, height: number): Point {
  return {
    x: (1 - landmark.x) * width,
    y: landmark.y * height,
  };
}

function lerpPoint(previous: Point | null, next: Point, alpha: number): Point {
  if (!previous) {
    return next;
  }

  return {
    x: previous.x + (next.x - previous.x) * alpha,
    y: previous.y + (next.y - previous.y) * alpha,
  };
}

function distanceBetween(a: Landmark, b: Landmark) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function isFingerExtended(
  landmarks: Landmark[],
  tipIndex: number,
  dipIndex: number,
  pipIndex: number,
  mcpIndex: number
) {
  return (
    landmarks[tipIndex].y < landmarks[dipIndex].y &&
    landmarks[dipIndex].y < landmarks[pipIndex].y &&
    landmarks[pipIndex].y < landmarks[mcpIndex].y
  );
}

export default function HandPainter() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cameraRef = useRef<{ stop?: () => void } | null>(null);
  const handsRef = useRef<{ close?: () => Promise<void> } | null>(null);
  const isActiveRef = useRef(false);
  const isSendingRef = useRef(false);
  const lastResultsRef = useRef<HandsResults | null>(null);
  const lastDrawPointRef = useRef<Point | null>(null);
  const smoothedPinchCenterRef = useRef<Point | null>(null);
  const scrollStateRef = useRef<ScrollState>({
    active: false,
    lostFrames: 0,
    scrollVelocity: 0,
    lastPinchCenter: null,
  });
  const trailSegmentsRef = useRef<TrailSegment[]>([]);
  const [status, setStatus] = useState("Requesting camera access...");

  useEffect(() => {
    let isCancelled = false;
    isActiveRef.current = true;

    const fitCanvas = () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const ratio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const drawFrame = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx) {
        animationFrameRef.current = window.requestAnimationFrame(drawFrame);
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const now = performance.now();

      ctx.clearRect(0, 0, width, height);

      const scrollState = scrollStateRef.current;
      if (scrollState.active && Math.abs(scrollState.scrollVelocity) > 0) {
        const scrollTop = window.scrollY;
        const maxScrollTop = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight
        );

        if (
          (scrollState.scrollVelocity < 0 && scrollTop <= 0) ||
          (scrollState.scrollVelocity > 0 && scrollTop >= maxScrollTop)
        ) {
          scrollState.active = false;
          scrollState.scrollVelocity = 0;
        } else {
        window.scrollBy({
          top: scrollState.scrollVelocity,
          behavior: "auto",
        });
        }
      }

      trailSegmentsRef.current = trailSegmentsRef.current.filter(
        (segment) => now - segment.createdAt <= MAX_SEGMENT_AGE
      );

      for (const segment of trailSegmentsRef.current) {
        const age = now - segment.createdAt;
        const alpha = Math.max(0, 1 - age / MAX_SEGMENT_AGE);

        ctx.strokeStyle = `hsla(${segment.hue} 95% 65% / ${alpha})`;
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 24;
        ctx.shadowColor = `hsla(${segment.hue} 95% 65% / ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.moveTo(segment.from.x, segment.from.y);
        ctx.lineTo(segment.to.x, segment.to.y);
        ctx.stroke();
      }

      const landmarks = lastResultsRef.current?.multiHandLandmarks?.[0];

      if (landmarks) {
        const points = landmarks.map((landmark) => projectLandmark(landmark, width, height));

        ctx.shadowBlur = 0;
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "rgba(149, 222, 255, 0.9)";

        for (const [start, end] of HAND_CONNECTIONS) {
          const from = points[start];
          const to = points[end];

          if (!from || !to) {
            continue;
          }

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }

        for (let index = 0; index < points.length; index += 1) {
          const point = points[index];
          const isIndexTip = index === 8;
          const radius = isIndexTip ? 7 : 4;
          const fill = isIndexTip ? "rgba(255, 184, 106, 0.98)" : "rgba(244, 247, 251, 0.92)";

          ctx.fillStyle = fill;
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(drawFrame);
    };

    const setup = async () => {
      try {
        await Promise.all(SCRIPT_URLS.map((url) => loadScript(url)));

        if (isCancelled || !window.Hands || !window.Camera) {
          return;
        }

        const video = videoRef.current;

        if (!video) {
          return;
        }

        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results) => {
          lastResultsRef.current = results;

          const landmarks = results.multiHandLandmarks?.[0];

          if (!landmarks) {
            lastDrawPointRef.current = null;
            smoothedPinchCenterRef.current = null;
            scrollStateRef.current.lostFrames += 1;

            if (scrollStateRef.current.lostFrames >= SCROLL_LOST_FRAMES) {
              scrollStateRef.current.active = false;
              scrollStateRef.current.scrollVelocity = 0;
              scrollStateRef.current.lastPinchCenter = null;
            }
            return;
          }

          const indexTip = landmarks[8];
          const middleTip = landmarks[12];
          if (!indexTip || !middleTip) {
            lastDrawPointRef.current = null;
            smoothedPinchCenterRef.current = null;
            scrollStateRef.current.lostFrames += 1;

            if (scrollStateRef.current.lostFrames >= SCROLL_LOST_FRAMES) {
              scrollStateRef.current.active = false;
              scrollStateRef.current.scrollVelocity = 0;
              scrollStateRef.current.lastPinchCenter = null;
            }
            return;
          }

          const width = window.innerWidth;
          const height = window.innerHeight;
          const indexPoint = projectLandmark(indexTip, width, height);

          if (lastDrawPointRef.current) {
            trailSegmentsRef.current.push({
              from: lastDrawPointRef.current,
              to: indexPoint,
              createdAt: performance.now(),
              hue: (performance.now() / 12) % 360,
            });
          }

          lastDrawPointRef.current = indexPoint;

          const pinchCenterRaw = projectLandmark(
            {
              x: (indexTip.x + middleTip.x) / 2,
              y: (indexTip.y + middleTip.y) / 2,
              z: (indexTip.z + middleTip.z) / 2,
            },
            width,
            height
          );

          const pinchCenter = lerpPoint(
            smoothedPinchCenterRef.current,
            pinchCenterRaw,
            PINCH_CENTER_SMOOTHING
          );
          smoothedPinchCenterRef.current = pinchCenter;

          const pinchSpread = distanceBetween(indexTip, middleTip);
          const isTwoFingerScroll = scrollStateRef.current.active
            ? pinchSpread <= PINCH_EXIT_SPREAD
            : isFingerExtended(landmarks, 12, 11, 10, 9) && pinchSpread <= PINCH_ENTER_SPREAD;

          if (!isTwoFingerScroll) {
            scrollStateRef.current.lostFrames += 1;

            if (scrollStateRef.current.lostFrames >= SCROLL_LOST_FRAMES) {
              scrollStateRef.current.active = false;
              scrollStateRef.current.scrollVelocity = 0;
              scrollStateRef.current.lastPinchCenter = null;
            }
            return;
          }

          scrollStateRef.current.active = true;
          scrollStateRef.current.lostFrames = 0;

          if (scrollStateRef.current.lastPinchCenter) {
            const deltaY = pinchCenter.y - scrollStateRef.current.lastPinchCenter.y;

            if (Math.abs(deltaY) < SCROLL_DEADZONE) {
            } else if (Math.abs(deltaY) >= SCROLL_TRIGGER_DELTA) {
              scrollStateRef.current.scrollVelocity = deltaY > 0 ? SCROLL_FIXED_STEP : -SCROLL_FIXED_STEP;
            }
          }

          scrollStateRef.current.lastPinchCenter = pinchCenter;
        });

        const camera = new window.Camera(video, {
          onFrame: async () => {
            if (isCancelled || !isActiveRef.current || isSendingRef.current) {
              return;
            }

            isSendingRef.current = true;

            try {
              if (!isCancelled && isActiveRef.current) {
                await hands.send({ image: video });
              }
            } catch (error) {
              if (!isCancelled) {
                console.error(error);
              }
            } finally {
              isSendingRef.current = false;
            }
          },
          width: 1280,
          height: 720,
        });

        handsRef.current = hands;
        cameraRef.current = camera;

        fitCanvas();
        animationFrameRef.current = window.requestAnimationFrame(drawFrame);
        await camera.start();

        if (!isCancelled) {
          setStatus("Draw with your index finger. Pinch index and middle fingers together to scroll.");
        }
      } catch (error) {
        console.error(error);
        if (!isCancelled) {
          setStatus("Camera or MediaPipe failed to initialize. Please check browser permissions.");
        }
      }
    };

    const handleResize = () => fitCanvas();

    window.addEventListener("resize", handleResize);
    fitCanvas();
    void setup();

    return () => {
      isCancelled = true;
      isActiveRef.current = false;
      window.removeEventListener("resize", handleResize);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      lastResultsRef.current = null;
      lastDrawPointRef.current = null;
      smoothedPinchCenterRef.current = null;
      scrollStateRef.current = {
        active: false,
        lostFrames: 0,
        scrollVelocity: 0,
        lastPinchCenter: null,
      };
      isSendingRef.current = false;

      cameraRef.current?.stop?.();
      cameraRef.current = null;

      const handsInstance = handsRef.current;
      handsRef.current = null;
      void handsInstance?.close?.();
    };
  }, []);

  return (
    <>
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="hand-painter-layer" />
      <div className="hand-painter-hud">
        <p className="hand-painter-kicker">MediaPipe</p>
        <p className="hand-painter-copy">{status}</p>
      </div>
    </>
  );
}
