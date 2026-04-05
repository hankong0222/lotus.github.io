"use client";

import Image from "next/image";
import Link from "next/link";
import type { IdeaListItem, IdeaPage } from "@/content/ideas";

type IdeaBookProps = {
  accent: string;
  idea: IdeaListItem;
  previousIdea: IdeaListItem | null;
  nextIdea: IdeaListItem | null;
};

function BookSheet({
  pages,
  projectTitle,
  projectSubtitle,
  showProjectHeader,
}: {
  pages: IdeaPage[];
  projectTitle: string;
  projectSubtitle?: string;
  showProjectHeader: boolean;
}) {
  return (
    <article className="idea-book-page">
      {showProjectHeader ? (
        <header className="idea-book-project-header">
          <h1 className="idea-book-title">{projectTitle}</h1>
          {projectSubtitle ? <p className="idea-book-project-subtitle">{projectSubtitle}</p> : null}
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
  const midpoint = Math.ceil(idea.pages.length / 2);
  const leftPages = idea.pages.slice(0, midpoint);
  const rightPages = idea.pages.slice(midpoint);

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
          <div className="idea-book-spread">
            <BookSheet pages={leftPages} projectTitle={idea.title} projectSubtitle={idea.subtitle} showProjectHeader />
            <BookSheet pages={rightPages} projectTitle={idea.title} projectSubtitle={idea.subtitle} showProjectHeader={false} />

            {previousIdea ? (
              <Link
                href={`/ideas/${previousIdea.slug}`}
                className="idea-book-corner-hitarea idea-book-corner-hitarea-left"
                aria-label="Turn to previous project"
              />
            ) : null}

            {nextIdea ? (
              <Link
                href={`/ideas/${nextIdea.slug}`}
                className="idea-book-corner-hitarea idea-book-corner-hitarea-right"
                aria-label="Turn to next project"
              />
            ) : null}
          </div>
        </div>

        <div className="idea-book-footer">
          <div className="idea-book-nav idea-book-nav-left">
            {previousIdea ? (
              <Link href={`/ideas/${previousIdea.slug}`} className="idea-book-nav-button glass-card rounded-[1.6rem] px-5 py-4">
                <span className="idea-book-nav-label text-[color:var(--muted)]">Previous project</span>
                <span className="idea-book-nav-title text-[color:var(--foreground)]">{previousIdea.title}</span>
              </Link>
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
              <Link href={`/ideas/${nextIdea.slug}`} className="idea-book-nav-button glass-card rounded-[1.6rem] px-5 py-4">
                <span className="idea-book-nav-label text-[color:var(--muted)]">Next project</span>
                <span className="idea-book-nav-title text-[color:var(--foreground)]">{nextIdea.title}</span>
              </Link>
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
