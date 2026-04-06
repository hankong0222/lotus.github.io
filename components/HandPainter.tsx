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

type HandResults = {
  multiHandLandmarks?: Landmark[][];
};

type GestureCategory = {
  categoryName: string;
  score: number;
};

type GestureResults = {
  gestures?: GestureCategory[][];
  landmarks?: Landmark[][];
};

type ScrollState = {
  pinched: boolean;
  direction: -1 | 0 | 1;
};

type GestureName =
  | "open-palm"
  | "victory"
  | "love"
  | "thumbs-up"
  | "ok"
  | "closed-fist"
  | null;

type DebugState = {
  pinchSpread: number;
  deltaY: number;
  direction: -1 | 0 | 1;
  pinched: boolean;
  middleExtended: boolean;
  gesture: GestureName;
};

type VisionModule = {
  FilesetResolver: {
    forVisionTasks: (wasmRoot: string) => Promise<unknown>;
  };
  GestureRecognizer: {
    createFromOptions: (
      vision: unknown,
      options: Record<string, unknown>
    ) => Promise<{
      recognize: (source: HTMLCanvasElement | HTMLVideoElement) => GestureResults;
      recognizeForVideo: (
        source: HTMLVideoElement | HTMLCanvasElement,
        timestampMs: number
      ) => GestureResults;
      close?: () => void;
    }>;
  };
};

declare global {
  interface Window {
    HAND_CONNECTIONS?: Array<[number, number]>;
    Hands?: new (config: { locateFile: (file: string) => string }) => {
      setOptions: (options: Record<string, number | boolean>) => void;
      onResults: (callback: (results: HandResults) => void) => void;
      send: (input: { image: HTMLVideoElement }) => Promise<void>;
      close?: () => Promise<void>;
    };
    __mpVision?: VisionModule;
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
  "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
  "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
];

const TASKS_VISION_WASM_ROOT =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm";
const GESTURE_MODEL_ASSET_PATH =
  "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task";

const MAX_SEGMENT_AGE = 3000;
const SCROLL_SPEED_PER_SECOND = 800;
const PINCH_CENTER_SMOOTHING = 0.18;
const SCROLL_START_DELTA = 5;
const SCROLL_SWITCH_DELTA = 9;
const PINCH_ENTER_SPREAD = 0.07;
const PINCH_EXIT_SPREAD = 0.095;
const GESTURE_STABLE_FRAMES = 8;
const GESTURE_COOLDOWN_MS = 1400;
const GESTURE_RECOGNITION_INTERVAL_MS = 260;

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

function loadTasksVision() {
  return (async () => {
    if (window.__mpVision) {
      return;
    }

    const tasksVisionModule = (await import("@mediapipe/tasks-vision")) as unknown as VisionModule;

    window.__mpVision = {
      FilesetResolver: tasksVisionModule.FilesetResolver,
      GestureRecognizer: tasksVisionModule.GestureRecognizer,
    };
  })();
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

function mapOfficialGesture(categoryName: string | undefined): GestureName {
  switch (categoryName) {
    case "Open_Palm":
      return "open-palm";
    case "Closed_Fist":
      return "closed-fist";
    case "Victory":
      return "victory";
    case "Thumb_Up":
      return "thumbs-up";
    case "ILoveYou":
      return "love";
    default:
      return null;
  }
}

function isOkGesture(landmarks: Landmark[]) {
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleExtended = isFingerExtended(landmarks, 12, 11, 10, 9);
  const ringExtended = isFingerExtended(landmarks, 16, 15, 14, 13);
  const pinkyExtended = isFingerExtended(landmarks, 20, 19, 18, 17);

  if (!thumbTip || !indexTip) {
    return false;
  }

  return (
    distanceBetween(thumbTip, indexTip) <= 0.06 &&
    middleExtended &&
    ringExtended &&
    pinkyExtended
  );
}

function isIgnorableGestureRecognizerError(error: unknown) {
  const text =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? `${error.name} ${error.message} ${error.stack ?? ""}`
        : `${String(error)} ${JSON.stringify(error)}`;

  return (
    text.includes("INFO: Created") ||
    text.includes("NFO: Created") ||
    text.includes("XNNPACK delegate for CPU") ||
    text.includes("TensorFlow Lite XNNPACK delegate") ||
    text.includes("Created TensorFlow Lite")
  );
}

function navigateToGestureTarget(gesture: Exclude<GestureName, null>) {
  const scrollElement =
    document.getElementById("app-scroll-root") ?? document.scrollingElement ?? document.documentElement;

  const sectionIdByGesture: Record<Exclude<GestureName, null>, string | "bottom"> = {
    "open-palm": "home",
    "closed-fist": "about",
    victory: "projects",
    ok: "ideas",
    "thumbs-up": "thinking",
    love: "bottom",
  };

  const target = sectionIdByGesture[gesture];

  if (target === "bottom") {
    scrollElement.scrollTop = scrollElement.scrollHeight;
    return;
  }

  const section = document.getElementById(target);

  if (!section) {
    return;
  }

  const sectionTop =
    section.getBoundingClientRect().top - scrollElement.getBoundingClientRect().top;
  scrollElement.scrollTop += sectionTop;
}

function waitForVideoReady(video: HTMLVideoElement) {
  return new Promise<void>((resolve, reject) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve();
      return;
    }

    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Video stream failed to initialize."));
    };
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("canplay", onLoaded);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("loadedmetadata", onLoaded, { once: true });
    video.addEventListener("canplay", onLoaded, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

export default function HandPainter() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gestureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const processingFrameRef = useRef<number | null>(null);
  const gestureLoopRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const lastGestureVideoTimeRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<{ close?: () => Promise<void> } | null>(null);
  const recognizerRef = useRef<{
    recognize: (source: HTMLCanvasElement | HTMLVideoElement) => GestureResults;
    recognizeForVideo: (
      source: HTMLVideoElement | HTMLCanvasElement,
      timestampMs: number
    ) => GestureResults;
    close?: () => void;
  } | null>(null);
  const recognizerMutedRef = useRef(false);
  const isActiveRef = useRef(false);
  const isSendingHandsRef = useRef(false);
  const lastHandResultsRef = useRef<HandResults | null>(null);
  const lastDrawPointRef = useRef<Point | null>(null);
  const lastPinchCenterRef = useRef<Point | null>(null);
  const filteredPinchCenterRef = useRef<Point | null>(null);
  const gestureStateRef = useRef<{
    candidate: GestureName;
    stableFrames: number;
    lastTriggeredAt: number;
  }>({
    candidate: null,
    stableFrames: 0,
    lastTriggeredAt: 0,
  });
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
    gesture: null,
  });

  useEffect(() => {
    let isCancelled = false;
    isActiveRef.current = true;
    const videoElement = videoRef.current;

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
      const deltaSeconds =
        lastFrameTimeRef.current === null ? 0 : (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;

      ctx.clearRect(0, 0, width, height);

      const scrollState = scrollStateRef.current;
      if (scrollState.pinched && scrollState.direction !== 0 && deltaSeconds > 0) {
        const scrollElement =
          document.getElementById("app-scroll-root") ??
          document.scrollingElement ??
          document.documentElement;
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

      const landmarks = lastHandResultsRef.current?.multiHandLandmarks?.[0];

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

    const processGestureResults = (
      gesture: GestureName,
      pinchSpread: number,
      isMiddleExtended: boolean
    ) => {
      const gestureState = gestureStateRef.current;
      const now = performance.now();

      if (gesture === gestureState.candidate) {
        gestureState.stableFrames += 1;
      } else {
        gestureState.candidate = gesture;
        gestureState.stableFrames = gesture ? 1 : 0;
      }

      if (
        gesture &&
        gestureState.stableFrames >= GESTURE_STABLE_FRAMES &&
        now - gestureState.lastTriggeredAt >= GESTURE_COOLDOWN_MS
      ) {
        navigateToGestureTarget(gesture);
        gestureState.lastTriggeredAt = now;
        gestureState.stableFrames = 0;
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
          gesture,
        });
        return true;
      }

      return false;
    };

    const runGestureRecognition = () => {
      const video = videoElement;
      const recognizer = recognizerRef.current;
      const gestureCanvas = gestureCanvasRef.current;

      if (
        !video ||
        !recognizer ||
        recognizerMutedRef.current ||
        !gestureCanvas ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        return;
      }

      const videoTime = video.currentTime;

      if (
        !Number.isFinite(videoTime) ||
        videoTime <= 0 ||
        videoTime === lastGestureVideoTimeRef.current
      ) {
        return;
      }

      const frameWidth = video.videoWidth || 0;
      const frameHeight = video.videoHeight || 0;
      const gestureCtx = gestureCanvas.getContext("2d");

      if (!gestureCtx || frameWidth <= 0 || frameHeight <= 0) {
        return;
      }

      if (gestureCanvas.width !== frameWidth || gestureCanvas.height !== frameHeight) {
        gestureCanvas.width = frameWidth;
        gestureCanvas.height = frameHeight;
      }

      lastGestureVideoTimeRef.current = videoTime;
      gestureCtx.drawImage(video, 0, 0, frameWidth, frameHeight);

      const landmarks = lastHandResultsRef.current?.multiHandLandmarks?.[0];
      const indexTip = landmarks?.[8];
      const middleTip = landmarks?.[12];
      const pinchSpread = indexTip && middleTip ? distanceBetween(indexTip, middleTip) : 0;
      const isMiddleExtended =
        landmarks && landmarks[12] && landmarks[11] && landmarks[10] && landmarks[9]
          ? isFingerExtended(landmarks, 12, 11, 10, 9)
          : false;

      const originalConsoleError = console.error;

      try {
        console.error = (...args: unknown[]) => {
          if (args.some((arg) => isIgnorableGestureRecognizerError(arg))) {
            recognizerMutedRef.current = true;
            return;
          }

          originalConsoleError(...args);
        };

        const gestureResults = recognizer.recognize(gestureCanvas);
        const gesture =
          landmarks && isOkGesture(landmarks)
            ? "ok"
            : mapOfficialGesture(gestureResults.gestures?.[0]?.[0]?.categoryName);
        void processGestureResults(gesture, pinchSpread, isMiddleExtended);
      } catch (error) {
        if (isIgnorableGestureRecognizerError(error)) {
          recognizerMutedRef.current = true;
          return;
        }

        console.error(error);
      } finally {
        console.error = originalConsoleError;
      }
    };

    const processHandResults = (results: HandResults) => {
      lastHandResultsRef.current = results;

      const landmarks = results.multiHandLandmarks?.[0];

      if (!landmarks) {
        lastDrawPointRef.current = null;
        lastPinchCenterRef.current = null;
        filteredPinchCenterRef.current = null;
        gestureStateRef.current.candidate = null;
        gestureStateRef.current.stableFrames = 0;
        scrollStateRef.current.pinched = false;
        scrollStateRef.current.direction = 0;
        setDebug((prev) => ({
          ...prev,
          pinchSpread: 0,
          deltaY: 0,
          direction: 0,
          pinched: false,
          middleExtended: false,
          gesture: null,
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
        setDebug((prev) => ({
          ...prev,
          pinchSpread,
          deltaY: 0,
          direction: 0,
          pinched: false,
          middleExtended: isMiddleExtended,
        }));
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
      setDebug((prev) => ({
        ...prev,
        pinchSpread,
        deltaY,
        direction: scrollStateRef.current.direction,
        pinched: scrollStateRef.current.pinched,
        middleExtended: isMiddleExtended,
      }));
    };

    const setup = async () => {
      try {
        await Promise.all([...SCRIPT_URLS.map((url) => loadScript(url)), loadTasksVision()]);

        if (isCancelled || !window.Hands || !window.__mpVision) {
          return;
        }

        const video = videoElement;

        if (!video) {
          return;
        }

        gestureCanvasRef.current = document.createElement("canvas");

        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.5,
        });

        hands.onResults(processHandResults);
        handsRef.current = hands;

        const vision = await window.__mpVision.FilesetResolver.forVisionTasks(
          TASKS_VISION_WASM_ROOT
        );
        const recognizer = await window.__mpVision.GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: GESTURE_MODEL_ASSET_PATH,
            delegate: "CPU",
          },
          runningMode: "IMAGE",
          numHands: 1,
          minHandDetectionConfidence: 0.55,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          cannedGesturesClassifierOptions: {
            categoryAllowlist: [
              "Open_Palm",
              "Closed_Fist",
              "Victory",
              "Thumb_Up",
              "ILoveYou",
            ],
            scoreThreshold: 0.55,
          },
        });

        recognizerRef.current = recognizer;
        fitCanvas();
        animationFrameRef.current = window.requestAnimationFrame(drawFrame);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        video.srcObject = stream;
        await waitForVideoReady(video);
        await video.play();

        const processVideoFrame = async () => {
          if (isCancelled || !isActiveRef.current) {
            return;
          }

          if (!isSendingHandsRef.current && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            isSendingHandsRef.current = true;

            try {
              await hands.send({ image: video });
            } catch (error) {
              if (!isCancelled) {
                console.error(error);
              }
            } finally {
              isSendingHandsRef.current = false;
            }
          }

          processingFrameRef.current = window.requestAnimationFrame(() => {
            void processVideoFrame();
          });
        };

        void processVideoFrame();
        gestureLoopRef.current = window.setInterval(runGestureRecognition, GESTURE_RECOGNITION_INTERVAL_MS);

        if (!isCancelled) {
          setStatus(
            "Gestures: 👋 Home, ✊ About, ✌️ Projects, 👌 Ideas, 👍 Thinking, 🤟 Contact. ☝️ Draw with index finger & Pinched index + middle fingers scroll."
          );
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
      if (processingFrameRef.current !== null) {
        window.cancelAnimationFrame(processingFrameRef.current);
      }
      if (gestureLoopRef.current !== null) {
        window.clearInterval(gestureLoopRef.current);
      }

      lastHandResultsRef.current = null;
      lastDrawPointRef.current = null;
      lastPinchCenterRef.current = null;
      filteredPinchCenterRef.current = null;
      gestureStateRef.current = {
        candidate: null,
        stableFrames: 0,
        lastTriggeredAt: 0,
      };
      lastFrameTimeRef.current = null;
      lastGestureVideoTimeRef.current = null;
      scrollStateRef.current = {
        pinched: false,
        direction: 0,
      };
      recognizerMutedRef.current = false;
      isSendingHandsRef.current = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (videoElement) {
        videoElement.pause();
        videoElement.srcObject = null;
      }

      gestureCanvasRef.current = null;

      const handsInstance = handsRef.current;
      handsRef.current = null;
      void handsInstance?.close?.();

      const recognizerInstance = recognizerRef.current;
      recognizerRef.current = null;
      recognizerInstance?.close?.();
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
          spread {debug.pinchSpread.toFixed(3)} | dy {debug.deltaY.toFixed(2)} | dir{" "}
          {debug.direction}
        </p>
        <p className="hand-painter-copy">
          pinch {debug.pinched ? "on" : "off"} | middle {debug.middleExtended ? "up" : "down"}
        </p>
        <p className="hand-painter-copy">gesture {debug.gesture ?? "none"}</p>
      </div>
    </>
  );
}
