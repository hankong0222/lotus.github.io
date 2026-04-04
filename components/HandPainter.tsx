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
  pinched: boolean;
  direction: -1 | 0 | 1;
};

type DebugState = {
  pinchSpread: number;
  deltaY: number;
  direction: -1 | 0 | 1;
  pinched: boolean;
  middleExtended: boolean;
};

declare global {
  interface Window {
    Camera?: new (
      video: HTMLVideoElement,
      options: { onFrame: () => Promise<void>; width: number; height: number }
    ) => { start: () => Promise<void>; stop?: () => void };
    HAND_CONNECTIONS?: Array<[number, number]>;
    Hands?: new (config: { locateFile: (file: string) => string }) => {
      setOptions: (options: Record<string, number | boolean>) => void;
      onResults: (callback: (results: HandsResults) => void) => void;
      send: (input: { image: HTMLVideoElement }) => Promise<void>;
      close?: () => Promise<void>;
    };
    drawConnectors?: (
      ctx: CanvasRenderingContext2D,
      landmarks: Landmark[],
      connections: Array<[number, number]>,
      style?: { color?: string; lineWidth?: number }
    ) => void;
    drawLandmarks?: (
      ctx: CanvasRenderingContext2D,
      landmarks: Landmark[],
      style?: { color?: string; lineWidth?: number; radius?: number }
    ) => void;
  }
}

const SCRIPT_URLS = [
  "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
  "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
  "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
];

const MAX_SEGMENT_AGE = 3000;
const SCROLL_SPEED_PER_SECOND = 800;
const PINCH_CENTER_SMOOTHING = 0.18;
const SCROLL_START_DELTA = 5;
const SCROLL_SWITCH_DELTA = 9;
const PINCH_ENTER_SPREAD = 0.07;
const PINCH_EXIT_SPREAD = 0.095;
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
  const lastFrameTimeRef = useRef<number | null>(null);
  const cameraRef = useRef<{ stop?: () => void } | null>(null);
  const handsRef = useRef<{ close?: () => Promise<void> } | null>(null);
  const isActiveRef = useRef(false);
  const isSendingRef = useRef(false);
  const lastResultsRef = useRef<HandsResults | null>(null);
  const lastDrawPointRef = useRef<Point | null>(null);
  const lastPinchCenterRef = useRef<Point | null>(null);
  const filteredPinchCenterRef = useRef<Point | null>(null);
  const scrollStateRef = useRef<ScrollState>({
    pinched: false,
    direction: 0,
  });
  const trailSegmentsRef = useRef<TrailSegment[]>([]);
  const [status, setStatus] = useState("Requesting camera access...");
  const [debug, setDebug] = useState<DebugState>({
    pinchSpread: 0,
    deltaY: 0,
    direction: 0,
    pinched: false,
    middleExtended: false,
  });

  useEffect(() => {
    let isCancelled = false;
    isActiveRef.current = true;

    const fitCanvas = () => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const drawFrame = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx) {
        animationFrameRef.current = window.requestAnimationFrame(drawFrame);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const now = performance.now();
      const deltaSeconds = lastFrameTimeRef.current === null ? 0 : (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;

      ctx.clearRect(0, 0, width, height);

      const scrollState = scrollStateRef.current;
      if (scrollState.pinched && scrollState.direction !== 0 && deltaSeconds > 0) {
        const scrollElement =
          document.getElementById("app-scroll-root") ?? document.scrollingElement ?? document.documentElement;
        const scrollTop = scrollElement.scrollTop;
        const maxScrollTop = Math.max(0, scrollElement.scrollHeight - window.innerHeight);
        const nextStep = scrollState.direction * SCROLL_SPEED_PER_SECOND * deltaSeconds;

        if (
          (scrollState.direction < 0 && scrollTop > 0) ||
          (scrollState.direction > 0 && scrollTop < maxScrollTop)
        ) {
          scrollElement.scrollTop = Math.max(0, Math.min(maxScrollTop, scrollTop + nextStep));
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

      if (
        landmarks &&
        window.drawConnectors &&
        window.drawLandmarks &&
        window.HAND_CONNECTIONS
      ) {
        ctx.save();
        ctx.translate(width, 0);
        ctx.scale(-1, 1);

        window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
          color: "rgba(149, 222, 255, 0.9)",
          lineWidth: 2.5,
        });
        window.drawLandmarks(ctx, landmarks, {
          color: "rgba(244, 247, 251, 0.92)",
          lineWidth: 1,
          radius: 4,
        });

        const indexTip = landmarks[8];
        if (indexTip) {
          window.drawLandmarks(ctx, [indexTip], {
            color: "rgba(255, 184, 106, 0.98)",
            lineWidth: 1,
            radius: 7,
          });
        }

        ctx.restore();
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
            lastPinchCenterRef.current = null;
            filteredPinchCenterRef.current = null;
            scrollStateRef.current.pinched = false;
            scrollStateRef.current.direction = 0;
            setDebug((prev) => ({
              ...prev,
              pinchSpread: 0,
              deltaY: 0,
              direction: 0,
              pinched: false,
              middleExtended: false,
            }));
            return;
          }

          const indexTip = landmarks[8];
          const middleTip = landmarks[12];

          if (!indexTip || !middleTip) {
            lastDrawPointRef.current = null;
            lastPinchCenterRef.current = null;
            filteredPinchCenterRef.current = null;
            scrollStateRef.current.pinched = false;
            scrollStateRef.current.direction = 0;
            setDebug((prev) => ({
              ...prev,
              pinchSpread: 0,
              deltaY: 0,
              direction: 0,
              pinched: false,
              middleExtended: false,
            }));
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

          const rawPinchCenter = projectLandmark(
            {
              x: (indexTip.x + middleTip.x) / 2,
              y: (indexTip.y + middleTip.y) / 2,
              z: (indexTip.z + middleTip.z) / 2,
            },
            width,
            height
          );
          const pinchCenter = filteredPinchCenterRef.current
            ? {
                x:
                  filteredPinchCenterRef.current.x +
                  (rawPinchCenter.x - filteredPinchCenterRef.current.x) * PINCH_CENTER_SMOOTHING,
                y:
                  filteredPinchCenterRef.current.y +
                  (rawPinchCenter.y - filteredPinchCenterRef.current.y) * PINCH_CENTER_SMOOTHING,
              }
            : rawPinchCenter;
          filteredPinchCenterRef.current = pinchCenter;

          const pinchSpread = distanceBetween(indexTip, middleTip);
          const isMiddleExtended = isFingerExtended(landmarks, 12, 11, 10, 9);
          const isTwoFingerScroll = scrollStateRef.current.pinched
            ? pinchSpread <= PINCH_EXIT_SPREAD
            : isMiddleExtended && pinchSpread <= PINCH_ENTER_SPREAD;

          if (!isTwoFingerScroll) {
            scrollStateRef.current.pinched = false;
            scrollStateRef.current.direction = 0;
            lastPinchCenterRef.current = null;
            filteredPinchCenterRef.current = null;
            setDebug({
              pinchSpread,
              deltaY: 0,
              direction: 0,
              pinched: false,
              middleExtended: isMiddleExtended,
            });
            return;
          }

          scrollStateRef.current.pinched = true;
          let deltaY = 0;

          if (lastPinchCenterRef.current) {
            deltaY = pinchCenter.y - lastPinchCenterRef.current.y;

            if (
              scrollStateRef.current.direction === 0 &&
              Math.abs(deltaY) >= SCROLL_START_DELTA
            ) {
              scrollStateRef.current.direction = deltaY > 0 ? 1 : -1;
            } else if (
              scrollStateRef.current.direction !== 0 &&
              Math.sign(deltaY) !== scrollStateRef.current.direction &&
              Math.abs(deltaY) >= SCROLL_SWITCH_DELTA
            ) {
              scrollStateRef.current.direction = deltaY > 0 ? 1 : -1;
            }
          }

          lastPinchCenterRef.current = pinchCenter;
          setDebug({
            pinchSpread,
            deltaY,
            direction: scrollStateRef.current.direction,
            pinched: scrollStateRef.current.pinched,
            middleExtended: isMiddleExtended,
          });
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
      lastPinchCenterRef.current = null;
      filteredPinchCenterRef.current = null;
      lastFrameTimeRef.current = null;
      scrollStateRef.current = {
        pinched: false,
        direction: 0,
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
        <p className="hand-painter-copy">
          spread {debug.pinchSpread.toFixed(3)} | dy {debug.deltaY.toFixed(2)} | dir {debug.direction}
        </p>
        <p className="hand-painter-copy">
          pinch {debug.pinched ? "on" : "off"} | middle {debug.middleExtended ? "up" : "down"}
        </p>
      </div>
    </>
  );
}
