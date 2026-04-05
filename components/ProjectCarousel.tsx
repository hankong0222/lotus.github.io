"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import demoWithPrediction from "@/asset/demo_with_prediction.gif";
import pixelPet from "@/asset/pixel_pet.gif";
import betterMe from "@/asset/better_me.gif";
import type { Project } from "@/content/types";

type ProjectCarouselProps = {
  projects: Project[];
};

const ANIMATION_MS = 18000;
const previewAssetMap = {
  demo_with_prediction: demoWithPrediction,
  pixel_pet: pixelPet,
  better_me: betterMe,
} as const;

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstGroupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const firstGroup = firstGroupRef.current;

    if (!track || !firstGroup) {
      return;
    }

    const updateLoopWidth = () => {
      track.style.setProperty("--project-rail-loop-width", `${firstGroup.offsetWidth}px`);
      track.style.animationDuration = `${ANIMATION_MS}ms`;
    };

    updateLoopWidth();
    window.addEventListener("resize", updateLoopWidth);

    return () => {
      window.removeEventListener("resize", updateLoopWidth);
    };
  }, []);

  const getCurrentTranslate = () => {
    const track = trackRef.current;

    if (!track) {
      return 0;
    }

    const transform = window.getComputedStyle(track).transform;

    if (transform === "none") {
      return 0;
    }

    return new DOMMatrixReadOnly(transform).m41;
  };

  const freezeTrack = () => {
    const track = trackRef.current;

    if (!track) {
      return 0;
    }

    const currentX = getCurrentTranslate();
    track.style.animation = "none";
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    track.style.animationDelay = "0ms";
    return currentX;
  };

  const resumeTrack = () => {
    const track = trackRef.current;
    const firstGroup = firstGroupRef.current;

    if (!track || !firstGroup) {
      return;
    }

    const loopWidth = firstGroup.offsetWidth;
    const currentX = getCurrentTranslate();
    let normalizedX = currentX % loopWidth;

    if (normalizedX > 0) {
      normalizedX -= loopWidth;
    }

    const progress = Math.abs(normalizedX) / loopWidth;
    const delay = -progress * ANIMATION_MS;

    track.style.transition = "none";
    track.style.animation = "none";
    track.style.transform = `translate3d(${normalizedX}px, 0, 0)`;
    void track.offsetWidth;
    track.style.animation = `project-marquee ${ANIMATION_MS}ms linear infinite`;
    track.style.animationDelay = `${delay}ms`;
    track.style.transform = "";
  };

  const centerCard = (card: HTMLAnchorElement | null) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track || !card) {
      return;
    }

    const currentX = freezeTrack();
    const viewportRect = viewport.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const offsetToCenter = viewportRect.left + viewportRect.width / 2 - (cardRect.left + cardRect.width / 2);

    track.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
    track.style.transform = `translate3d(${currentX + offsetToCenter}px, 0, 0)`;
  };

  return (
    <div
      className="project-rail-shell mt-8"
      onMouseEnter={() => {
        freezeTrack();
      }}
      onMouseLeave={() => {
        resumeTrack();
      }}
    >
      <div className="project-rail-viewport" ref={viewportRef}>
        <div ref={trackRef} className="project-rail-track-animated">
          <div ref={firstGroupRef} className="project-rail-group">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onHoverCenter={centerCard} />
            ))}
          </div>
          <div className="project-rail-group" aria-hidden="true">
            {projects.map((project) => (
              <ProjectCard key={`${project.id}-clone`} project={project} onHoverCenter={centerCard} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onHoverCenter,
}: {
  project: Project;
  onHoverCenter: (card: HTMLAnchorElement | null) => void;
}) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const preview = project.previewAsset ? previewAssetMap[project.previewAsset as keyof typeof previewAssetMap] : null;

  return (
    <a
      href={project.githubUrl}
      ref={cardRef}
      target="_blank"
      rel="noreferrer"
      className="glass-card project-rail-card group block rounded-[2rem] p-6"
      onMouseEnter={() => onHoverCenter(cardRef.current)}
      onFocus={() => onHoverCenter(cardRef.current)}
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent-deep)] to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <h3 className="mt-4 text-2xl font-semibold">{project.title}</h3>
      {preview ? (
        <div className="mb-5 overflow-hidden rounded-[1.4rem] border border-white/8 bg-black/20">
          <Image src={preview} alt={`${project.title} preview`} className="h-56 w-full object-contain" unoptimized />
        </div>
      ) : null}
      <p className="mt-4 text-sm leading-6 text-[color:var(--text-muted)]">{project.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.slice(0, 3).map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.7rem] uppercase tracking-[0.16em] text-[color:var(--muted)]"
          >
            {item}
          </span>
        ))}
      </div>
    </a>
  );
}



