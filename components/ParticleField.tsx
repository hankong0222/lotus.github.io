"use client";

import { useEffect, useRef } from "react";

type Mode = "hero" | "projects" | "ideas" | "thinking" | "about" | "detail";
type PointKind = "edge" | "fill" | "center";

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  seed: number;
};

type Point2D = {
  x: number;
  y: number;
  kind: PointKind;
};

type Palette = {
  background: string;
  particle: string;
  glow: string;
};

const PARTICLE_COUNT = 156;

const palettes: Record<Mode, Palette> = {
  hero: { background: "11, 15, 24", particle: "255, 241, 214", glow: "255, 132, 82" },
  projects: { background: "8, 18, 33", particle: "224, 246, 255", glow: "93, 214, 255" },
  ideas: { background: "18, 11, 34", particle: "247, 231, 255", glow: "182, 115, 255" },
  thinking: { background: "19, 23, 26", particle: "245, 240, 228", glow: "255, 192, 91" },
  about: { background: "11, 24, 19", particle: "230, 248, 239", glow: "75, 206, 154" },
  detail: { background: "17, 18, 30", particle: "234, 238, 255", glow: "110, 133, 255" },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function modeFromString(value: string | null): Mode {
  if (value === "hero" || value === "projects" || value === "ideas" || value === "thinking" || value === "about" || value === "detail") {
    return value;
  }

  return "hero";
}

async function sampleLotusSvgShape(count: number): Promise<Point2D[]> {
  const image = new Image();
  image.src = "/lotus.svg";
  image.decoding = "async";

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load lotus SVG."));
  });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create sampling canvas.");
  }

  const sampleWidth = 300;
  const sampleHeight = 300;
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  context.drawImage(image, 0, 0, sampleWidth, sampleHeight);

  const { data } = context.getImageData(0, 0, sampleWidth, sampleHeight);
  const edgeCandidates: Point2D[] = [];
  const fillCandidates: Point2D[] = [];

  for (let y = 0; y < sampleHeight; y += 2) {
    for (let x = 0; x < sampleWidth; x += 2) {
      const index = (y * sampleWidth + x) * 4;
      const alpha = data[index + 3];
      if (alpha < 10) continue;

      const nx = (x / sampleWidth - 0.5) * 2;
      const ny = (y / sampleHeight - 0.5) * 2;
      const left = x > 0 ? data[(y * sampleWidth + (x - 1)) * 4 + 3] : 0;
      const right = x < sampleWidth - 1 ? data[(y * sampleWidth + (x + 1)) * 4 + 3] : 0;
      const top = y > 0 ? data[((y - 1) * sampleWidth + x) * 4 + 3] : 0;
      const bottom = y < sampleHeight - 1 ? data[((y + 1) * sampleWidth + x) * 4 + 3] : 0;
      const isEdge = left < 10 || right < 10 || top < 10 || bottom < 10;

      if (isEdge) {
        edgeCandidates.push({ x: nx, y: ny, kind: "edge" });
      } else if (Math.abs(nx) < 0.18 && ny > -0.25 && ny < 0.1) {
        fillCandidates.push({ x: nx, y: ny, kind: "fill" });
      }
    }
  }

  const result: Point2D[] = [];
  const edgeCount = Math.min(Math.floor(count * 0.78), edgeCandidates.length);
  const fillCount = Math.min(Math.floor(count * 0.08), fillCandidates.length);

  for (let index = 0; index < edgeCount; index += 1) {
    result.push(edgeCandidates[Math.floor((index / Math.max(edgeCount, 1)) * edgeCandidates.length)]);
  }

  for (let index = 0; index < fillCount; index += 1) {
    result.push(fillCandidates[Math.floor((index / Math.max(fillCount, 1)) * fillCandidates.length)]);
  }

  const centerPetals = Array.from({ length: count - result.length }, (_, index) => {
    const petalIndex = index % 5;
    const petalOffsets = [
      { x: 0, y: -0.18 },
      { x: -0.14, y: -0.08 },
      { x: 0.14, y: -0.08 },
      { x: -0.06, y: 0.02 },
      { x: 0.06, y: 0.02 },
    ];
    const row = Math.floor(index / 5);
    const t = ((row % 7) + 0.5) / 7;
    const span = ((row % 3) - 1) / 4;
    const offset = petalOffsets[petalIndex];
    return {
      x: offset.x + span * Math.sin(t * Math.PI) * 0.18,
      y: offset.y + (0.5 - t) * (petalIndex === 0 ? 0.28 : 0.2),
      kind: "center" as const,
    };
  });

  return [...result, ...centerPetals];
}

function createBudPoint(point: Point2D) {
  return {
    x: point.x * 0.08,
    y: point.y * 0.2 - 0.26 - Math.abs(point.x) * 0.08,
  };
}

function createTargets(mode: Mode, width: number, height: number, bloomProgress: number, bloomShape: Point2D[]) {
  const configs: Record<Mode, { scale: number; lift: number; stretchX: number; stretchY: number }> = {
    hero: { scale: 0.46, lift: 0.05, stretchX: 1, stretchY: 1 },
    projects: { scale: 0.43, lift: 0.03, stretchX: 1.02, stretchY: 0.98 },
    ideas: { scale: 0.48, lift: 0.04, stretchX: 1.06, stretchY: 1.02 },
    thinking: { scale: 0.4, lift: 0.02, stretchX: 0.96, stretchY: 0.96 },
    about: { scale: 0.44, lift: 0.06, stretchX: 0.98, stretchY: 1 },
    detail: { scale: 0.5, lift: 0.03, stretchX: 1.08, stretchY: 1.04 },
  };

  const config = configs[mode];
  const size = Math.min(width, height) * config.scale;

  return bloomShape.map((point) => {
    const bud = createBudPoint(point);
    return {
      x: lerp(bud.x, point.x * config.stretchX, bloomProgress) * size,
      y: lerp(bud.y, point.y * config.stretchY, bloomProgress) * size - height * config.lift,
    };
  });
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      vx: 0,
      vy: 0,
      size: 1.2 + (index % 5) * 0.45,
      seed: Math.random() * 1000,
    }));

    let width = 0;
    let height = 0;
    let dpr = 1;
    let bloomShape: Point2D[] = Array.from({ length: PARTICLE_COUNT }, () => ({ x: 0, y: 0, kind: "fill" }));
    let targets = createTargets("hero", window.innerWidth, window.innerHeight, 0, bloomShape);
    let activeMode: Mode = "hero";
    let palette = palettes.hero;
    let frame = 0;
    const scrollRoot = document.getElementById("app-scroll-root");
    let scrollY = scrollRoot?.scrollTop ?? window.scrollY;
    let bloomProgress = 0;
    const mouse = { x: 0, y: 0 };
    const visibleSections = new Map<Element, number>();

    const updateTargets = () => {
      targets = createTargets(activeMode, width, height, bloomProgress, bloomShape);
      particles.forEach((particle, index) => {
        particle.tx = targets[index].x;
        particle.ty = targets[index].y;
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateTargets();
    };

    const setMode = (mode: Mode) => {
      activeMode = mode;
      palette = palettes[mode];
      updateTargets();
    };

    const syncMode = () => {
      let bestMode: Mode = "hero";
      let bestRatio = 0;

      visibleSections.forEach((ratio, element) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestMode = modeFromString(element.getAttribute("data-particle-mode"));
        }
      });

      if (bestMode !== activeMode) {
        setMode(bestMode);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target);
          }
        });
        syncMode();
      },
      {
        root: scrollRoot,
        threshold: [0.1, 0.2, 0.35, 0.5, 0.7, 0.9],
      },
    );

    document.querySelectorAll("[data-particle-mode]").forEach((element) => observer.observe(element));

    const onScroll = () => {
      const currentScrollRoot = document.getElementById("app-scroll-root");
      scrollY = currentScrollRoot?.scrollTop ?? window.scrollY;
      const maxScroll = currentScrollRoot
        ? Math.max(currentScrollRoot.scrollHeight - currentScrollRoot.clientHeight, 1)
        : Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      bloomProgress = clamp(scrollY / maxScroll, 0, 1);
      updateTargets();
    };

    const onPointerMove = (event: PointerEvent) => {
      mouse.x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      mouse.y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
    };

    const render = () => {
      if (width <= 0 || height <= 0) {
        frame = window.requestAnimationFrame(render);
        return;
      }

      context.clearRect(0, 0, width, height);
      context.fillStyle = `rgba(${palette.background}, 0.84)`;
      context.fillRect(0, 0, width, height);

      const parallaxX = mouse.x * 22;
      const parallaxY = mouse.y * 14 + scrollY * 0.01;

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        const source = bloomShape[index];

        particle.vx += ((particle.tx + parallaxX * (source.kind === "center" ? 0.16 : 0.08)) - particle.x) * 0.012;
        particle.vy += ((particle.ty + parallaxY * (source.kind === "center" ? 0.08 : 0.04)) - particle.y) * 0.012;
        particle.vx *= 0.9;
        particle.vy *= 0.9;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const glowRadius = particle.size * (source.kind === "center" ? 7.5 : source.kind === "edge" ? 5 : 4.2);
        const glow = context.createRadialGradient(
          particle.x + width / 2,
          particle.y + height / 2,
          0,
          particle.x + width / 2,
          particle.y + height / 2,
          glowRadius,
        );
        glow.addColorStop(0, `rgba(${palette.glow}, ${source.kind === "center" ? "0.34" : "0.18"})`);
        glow.addColorStop(1, `rgba(${palette.glow}, 0)`);
        context.fillStyle = glow;
        context.beginPath();
        context.arc(particle.x + width / 2, particle.y + height / 2, glowRadius, 0, Math.PI * 2);
        context.fill();

        context.fillStyle =
          source.kind === "center"
            ? `rgba(${palette.particle}, 0.98)`
            : source.kind === "edge"
              ? `rgba(${palette.particle}, 0.92)`
              : `rgba(${palette.particle}, 0.72)`;
        context.beginPath();
        context.arc(
          particle.x + width / 2,
          particle.y + height / 2,
          source.kind === "center" ? particle.size * 1.34 : source.kind === "edge" ? particle.size : particle.size * 0.88,
          0,
          Math.PI * 2,
        );
        context.fill();
      }

      frame = window.requestAnimationFrame(render);
    };

    let disposed = false;

    sampleLotusSvgShape(PARTICLE_COUNT)
      .then((points) => {
        if (disposed) return;
        bloomShape = points;
        onScroll();
        resize();
        setMode("hero");
      })
      .catch(() => {
        onScroll();
        resize();
        setMode("hero");
      });

    render();

    window.addEventListener("resize", resize);
    scrollRoot?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", resize);
      scrollRoot?.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}
