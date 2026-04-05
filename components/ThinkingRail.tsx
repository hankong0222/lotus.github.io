"use client";

import { useState } from "react";
import { useEffect, useRef } from "react";
import { thinkingEssays } from "@/content/thinking";

const ANIMATION_MS = 22000;

export default function ThinkingRail() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstGroupRef = useRef<HTMLDivElement | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const firstGroup = firstGroupRef.current;

    if (!track || !firstGroup) {
      return;
    }

    const updateLoopWidth = () => {
      track.style.animationDuration = `${ANIMATION_MS}ms`;
      track.style.setProperty("--thinking-rail-loop-width", `${firstGroup.offsetWidth}px`);
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
    track.style.animation = `thinking-marquee ${ANIMATION_MS}ms linear infinite`;
    track.style.animationDelay = `${delay}ms`;
    track.style.transform = "";
  };

  const centerCard = (card: HTMLElement | null) => {
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
      className="project-rail-shell thinking-rail-shell mt-8"
      onMouseEnter={() => {
        freezeTrack();
      }}
      onMouseLeave={() => {
        setActiveCardId(null);
        resumeTrack();
      }}
    >
      <div className="thinking-rail-viewport" ref={viewportRef}>
        <div ref={trackRef} className="thinking-rail-track-animated">
          <div ref={firstGroupRef} className="thinking-rail-group">
            {thinkingEssays.map((essay) => (
              <ThinkingCard
                key={essay.id}
                essay={essay}
                active={activeCardId === essay.id}
                onActivate={(card) => {
                  setActiveCardId(essay.id);
                  centerCard(card);
                }}
              />
            ))}
          </div>
          <div className="thinking-rail-group" aria-hidden="true">
            {thinkingEssays.map((essay) => (
              <ThinkingCard
                key={`${essay.id}-clone`}
                essay={essay}
                active={activeCardId === `${essay.id}-clone`}
                onActivate={(card) => {
                  setActiveCardId(`${essay.id}-clone`);
                  centerCard(card);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThinkingCard({
  essay,
  active,
  onActivate,
}: {
  essay: (typeof thinkingEssays)[number];
  active: boolean;
  onActivate: (card: HTMLElement | null) => void;
}) {
  const cardRef = useRef<HTMLElement | null>(null);

  return (
    <article
      ref={cardRef}
      className={`thinking-rail-card project-rail-card glass-card group rounded-[2rem]${active ? " thinking-rail-card-active" : ""}`}
      tabIndex={0}
      onMouseEnter={() => onActivate(cardRef.current)}
      onFocus={() => onActivate(cardRef.current)}
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent-deep)] to-transparent opacity-0 transition duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <h3 className="thinking-rail-title">{essay.title}</h3>
      <div className="thinking-rail-summary">
        {essay.pages.map((section) => (
          <div key={section.title} className="thinking-rail-section">
            <p className="thinking-rail-section-title">{section.title}</p>
            <div className="thinking-rail-section-body">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="thinking-rail-section-content">{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
