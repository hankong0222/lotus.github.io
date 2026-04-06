"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { IdeaListItem, IdeaPage } from "@/content/types";

type IdeaBookProps = {
  accent: string;
  idea: IdeaListItem;
  previousIdea: IdeaListItem | null;
  nextIdea: IdeaListItem | null;
};

function splitIdeaPages(item: IdeaListItem) {
  const midpoint = Math.ceil(item.pages.length / 2);

  return {
    leftPages: item.pages.slice(0, midpoint),
    rightPages: item.pages.slice(midpoint),
  };
}

function BookSheet({
  pages,
  projectTitle,
  projectSubtitle,
  projectHeroImage,
  showProjectHeader,
  className,
}: {
  pages: IdeaPage[];
  projectTitle: string;
  projectSubtitle?: string;
  projectHeroImage?: IdeaListItem["heroImage"];
  showProjectHeader: boolean;
  className?: string;
}) {
  return (
    <article className={`idea-book-page${className ? ` ${className}` : ""}`}>
      {showProjectHeader ? (
        <header className="idea-book-project-header">
          <h1 className="idea-book-title">{projectTitle}</h1>
          {projectSubtitle ? <p className="idea-book-project-subtitle">{projectSubtitle}</p> : null}
          {projectHeroImage ? (
            <figure className="idea-book-hero-figure">
              <div className="idea-book-hero-frame">
                <Image
                  src={projectHeroImage.src}
                  alt={projectHeroImage.alt}
                  width={1400}
                  height={900}
                  className="idea-book-image"
                />
              </div>
              {projectHeroImage.caption ? <figcaption className="idea-book-caption">{projectHeroImage.caption}</figcaption> : null}
            </figure>
          ) : null}
        </header>
      ) : null}
      <div className="idea-book-sheet-sections">
        {pages.map((page) => (
          <section key={page.title} className="idea-book-sheet-section">
            <h2 className="idea-book-title idea-book-title-inner">{page.title}</h2>
            <div className="idea-book-body">
              {page.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {page.image ? (
              <figure className="idea-book-figure">
                <div className="idea-book-figure-frame">
                  <Image
                    src={page.image.src}
                    alt={page.image.alt}
                    width={1200}
                    height={800}
                    className="idea-book-image"
                  />
                </div>
                {page.image.caption ? <figcaption className="idea-book-caption">{page.image.caption}</figcaption> : null}
              </figure>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}

export default function IdeaBook({ accent, idea, previousIdea, nextIdea }: IdeaBookProps) {
  const router = useRouter();
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward" | null>(null);
  const { leftPages, rightPages } = splitIdeaPages(idea);
  const isFlipping = flipDirection !== null;

  const flipTarget = useMemo(() => {
    if (flipDirection === "forward") {
      return nextIdea;
    }

    if (flipDirection === "backward") {
      return previousIdea;
    }

    return null;
  }, [flipDirection, nextIdea, previousIdea]);

  const flipTargetPages = useMemo(() => {
    if (!flipTarget) {
      return null;
    }

    return splitIdeaPages(flipTarget);
  }, [flipTarget]);

  const triggerFlip = useCallback((target: IdeaListItem | null, direction: "forward" | "backward") => {
    if (!target || isFlipping) {
      return;
    }

    setFlipDirection(direction);

    window.setTimeout(() => {
      router.push(`/ideas/${target.slug}`);
    }, 760);
  }, [isFlipping, router]);

  useEffect(() => {
    const handleIdeaBookSwipe = (event: WindowEventMap["idea-book-swipe"]) => {
      if (event.detail.direction === "left") {
        triggerFlip(nextIdea, "forward");
        return;
      }

      triggerFlip(previousIdea, "backward");
    };

    window.addEventListener("idea-book-swipe", handleIdeaBookSwipe);
    return () => {
      window.removeEventListener("idea-book-swipe", handleIdeaBookSwipe);
    };
  }, [nextIdea, previousIdea, triggerFlip]);

  return (
    <main className="idea-book-shell px-4 py-8 md:py-12">
      <div className="section-shell">
        <div className="idea-book-toolbar glass-card rounded-[2rem] px-5 py-4 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface)] px-4 py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Back home</span>
          </Link>

          <div className="idea-book-meta text-sm text-[color:var(--muted)]">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2"
              style={{ backgroundColor: `${accent}18`, borderColor: `${accent}50` }}
            >
              <span className="idea-book-dot" style={{ backgroundColor: accent }} />
              {idea.tag}
            </span>
            <span>{idea.time}</span>
          </div>
        </div>

        <div className="idea-book-stage">
          <div className="idea-book-shadow" />
          <div className={`idea-book-spread${isFlipping ? " idea-book-spread-flipping" : ""}`}>
            {flipDirection === "backward" && flipTarget && flipTargetPages ? (
              <div className="idea-book-underlay idea-book-underlay-left idea-book-underlay-reveal" aria-hidden="true">
                <BookSheet
                  pages={flipTargetPages.leftPages}
                  projectTitle={flipTarget.title}
                  projectSubtitle={flipTarget.subtitle}
                  projectHeroImage={flipTarget.heroImage}
                  showProjectHeader
                />
              </div>
            ) : null}

            {flipDirection === "forward" && flipTarget && flipTargetPages ? (
              <div className="idea-book-underlay idea-book-underlay-right idea-book-underlay-reveal" aria-hidden="true">
                <BookSheet
                  pages={flipTargetPages.rightPages}
                  projectTitle={flipTarget.title}
                  projectSubtitle={flipTarget.subtitle}
                  showProjectHeader={false}
                />
              </div>
            ) : null}

            <BookSheet
              pages={leftPages}
              projectTitle={idea.title}
              projectSubtitle={idea.subtitle}
              projectHeroImage={idea.heroImage}
              showProjectHeader
              className={flipDirection === "backward" ? "idea-book-page-hidden" : undefined}
            />
            <BookSheet
              pages={rightPages}
              projectTitle={idea.title}
              projectSubtitle={idea.subtitle}
              showProjectHeader={false}
              className={flipDirection === "forward" ? "idea-book-page-hidden" : undefined}
            />

            {flipDirection === "backward" ? (
              <div className="idea-book-flip-layer idea-book-flip-layer-backward" aria-hidden="true">
                <div className="idea-book-flip-face idea-book-flip-face-front">
                  <BookSheet
                    pages={leftPages}
                    projectTitle={idea.title}
                    projectSubtitle={idea.subtitle}
                    projectHeroImage={idea.heroImage}
                    showProjectHeader
                  />
                </div>
                <div className="idea-book-flip-face idea-book-flip-face-back">
                  <BookSheet
                    pages={flipTargetPages?.rightPages ?? rightPages}
                    projectTitle={flipTarget?.title ?? idea.title}
                    projectSubtitle={flipTarget?.subtitle}
                    showProjectHeader={false}
                  />
                </div>
              </div>
            ) : null}

            {flipDirection === "forward" ? (
              <div className="idea-book-flip-layer idea-book-flip-layer-forward" aria-hidden="true">
                <div className="idea-book-flip-face idea-book-flip-face-front">
                  <BookSheet pages={rightPages} projectTitle={idea.title} projectSubtitle={idea.subtitle} showProjectHeader={false} />
                </div>
                <div className="idea-book-flip-face idea-book-flip-face-back">
                  <BookSheet
                    pages={flipTargetPages?.leftPages ?? leftPages}
                    projectTitle={flipTarget?.title ?? idea.title}
                    projectSubtitle={flipTarget?.subtitle}
                    projectHeroImage={flipTarget?.heroImage}
                    showProjectHeader
                  />
                </div>
              </div>
            ) : null}

            {previousIdea ? (
              <button
                type="button"
                className="idea-book-corner-hitarea idea-book-corner-hitarea-left"
                aria-label="Turn to previous project"
                onClick={() => triggerFlip(previousIdea, "backward")}
              />
            ) : null}

            {nextIdea ? (
              <button
                type="button"
                className="idea-book-corner-hitarea idea-book-corner-hitarea-right"
                aria-label="Turn to next project"
                onClick={() => triggerFlip(nextIdea, "forward")}
              />
            ) : null}
          </div>
        </div>

        <div className="idea-book-footer">
          <div className="idea-book-nav idea-book-nav-left">
            {previousIdea ? (
              <button
                type="button"
                onClick={() => triggerFlip(previousIdea, "backward")}
                className="idea-book-nav-button glass-card rounded-[1.6rem] px-5 py-4"
              >
                <span className="idea-book-nav-label text-[color:var(--muted)]">Previous project</span>
                <span className="idea-book-nav-title text-[color:var(--foreground)]">{previousIdea.title}</span>
              </button>
            ) : (
              <div className="idea-book-nav-button idea-book-nav-button-disabled glass-card rounded-[1.6rem] px-5 py-4">
                <span className="idea-book-nav-label text-[color:var(--muted)]">Previous</span>
                <span className="idea-book-nav-title text-[color:var(--foreground)]">Start of archive</span>
              </div>
            )}
          </div>

          <div className="idea-book-centerline" />

          <div className="idea-book-nav idea-book-nav-right">
            {nextIdea ? (
              <button
                type="button"
                onClick={() => triggerFlip(nextIdea, "forward")}
                className="idea-book-nav-button glass-card rounded-[1.6rem] px-5 py-4"
              >
                <span className="idea-book-nav-label text-[color:var(--muted)]">Next project</span>
                <span className="idea-book-nav-title text-[color:var(--foreground)]">{nextIdea.title}</span>
              </button>
            ) : (
              <div className="idea-book-nav-button idea-book-nav-button-disabled glass-card rounded-[1.6rem] px-5 py-4">
                <span className="idea-book-nav-label text-[color:var(--muted)]">Next</span>
                <span className="idea-book-nav-title text-[color:var(--foreground)]">Most recent note</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
