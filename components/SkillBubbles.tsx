"use client";

import { useMemo, useRef, useState } from "react";
import { skillBubbles } from "@/content/about";

const sizeClassMap = {
  sm: "skill-bubble-sm",
  md: "skill-bubble-md",
  lg: "skill-bubble-lg",
} as const;

export default function SkillBubbles() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [nearLabel, setNearLabel] = useState<string | null>(null);
  const [hintPosition, setHintPosition] = useState<{ x: number; y: number } | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);

  const positionedSkills = useMemo(
    () =>
      skillBubbles.map((skill, index) => ({
        ...skill,
        driftX: ((index * 19) % 5) - 2,
        driftY: ((index * 13) % 7) - 3,
        gapBias: (index % 3) * 0.35,
      })),
    [],
  );

  const legendItems = useMemo(() => {
    const seen = new Set<string>();
    return positionedSkills.filter((skill) => {
      if (seen.has(skill.group)) {
        return false;
      }
      seen.add(skill.group);
      return true;
    });
  }, [positionedSkills]);

  const highlightedLabel = activeLabel ?? nearLabel;
  const activeSkill = positionedSkills.find((skill) => skill.label === highlightedLabel) ?? null;

  const updateHintPosition = (button: HTMLButtonElement | null) => {
    const field = fieldRef.current;

    if (!field || !button) {
      setHintPosition(null);
      return;
    }

    const fieldRect = field.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left - fieldRect.left + buttonRect.width / 2;
    const y = Math.max(12, buttonRect.top - fieldRect.top - 14);

    setHintPosition({ x, y });
  };

  return (
    <div className="skill-bubbles-shell">
      <div
        ref={fieldRef}
        className="skill-bubbles-field"
        onMouseMove={(event) => {
          const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-skill-bubble]"),
          );

          if (!buttons.length) {
            return;
          }

          const { clientX, clientY } = event;
          let closestLabel: string | null = null;
          let closestDistance = Number.POSITIVE_INFINITY;

          for (const button of buttons) {
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.hypot(centerX - clientX, centerY - clientY);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestLabel = button.dataset.skillBubble ?? null;
            }
          }

          const nextNearLabel = closestDistance < 120 ? closestLabel : null;
          setNearLabel(nextNearLabel);

          if (!activeLabel) {
            const targetButton = buttons.find((button) => button.dataset.skillBubble === nextNearLabel) ?? null;
            updateHintPosition(targetButton);
          }
        }}
        onMouseLeave={() => {
          setNearLabel(null);
          setHintPosition(null);
        }}
      >
        {activeSkill && hintPosition ? (
          <div
            className={`skill-bubble-inline-hint${activeLabel ? " skill-bubble-inline-hint-active" : ""}`}
            style={{
              left: hintPosition.x,
              top: hintPosition.y,
            }}
          >
            <span>{activeSkill.detail}</span>
          </div>
        ) : null}

        {positionedSkills.map((skill) => {
          const isActive = activeLabel === skill.label;
          const isNear = !isActive && nearLabel === skill.label;

          return (
            <button
              key={skill.label}
              type="button"
              data-skill-bubble={skill.label}
              className={`skill-bubble ${sizeClassMap[skill.size]}${isActive ? " skill-bubble-active" : ""}${isNear ? " skill-bubble-near" : ""}`}
              style={{
                ["--bubble-color" as string]: skill.color,
                transform: `translate(${skill.driftX}px, ${skill.driftY}px)`,
                marginInlineEnd: `${0.45 + skill.gapBias}rem`,
                marginBlockEnd: `${0.4 + skill.gapBias}rem`,
              }}
              onMouseEnter={(event) => {
                setActiveLabel(skill.label);
                updateHintPosition(event.currentTarget);
              }}
              onMouseLeave={() => {
                setActiveLabel((current) => (current === skill.label ? null : current));
              }}
              onFocus={(event) => {
                setActiveLabel(skill.label);
                updateHintPosition(event.currentTarget);
              }}
              onBlur={() => {
                setActiveLabel((current) => (current === skill.label ? null : current));
              }}
            >
              <span className="skill-bubble-glow" />
              <span className="skill-bubble-label">{skill.label}</span>
            </button>
          );
        })}
      </div>

      <div className="skill-bubble-legend">
        <p className="skill-bubble-legend-label">Color key</p>
        <div className="skill-bubble-legend-items">
          {legendItems.map((item) => (
            <div key={item.group} className="skill-bubble-legend-item">
              <span
                className="skill-bubble-legend-dot"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 0 16px ${item.color}`,
                }}
              />
              <span>{item.group}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
