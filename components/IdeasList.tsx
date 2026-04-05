"use client";

import Link from "next/link";
import { ideaListItems, ideaListTags } from "@/content/ideas";

function colorForTag(tag: string) {
  return ideaListTags.find((item) => item.label === tag)?.color ?? "#94a3b8";
}

export default function IdeasList() {
  return (
    <div className="glass-card mt-6 rounded-[2rem] p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
          <p className="section-kicker">Tags</p>
          <div className="mt-5 flex flex-col gap-3">
            {ideaListTags.map((tag) => (
              <div key={tag.label} className="flex items-center gap-3 text-sm text-[color:var(--foreground)]">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: tag.color, boxShadow: `0 0 18px ${tag.color}` }}
                />
                <span>{tag.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="rounded-[1.5rem] border border-white/8 bg-black/10 p-2">
          <div className="ideas-scroll-list max-h-[70vh] overflow-y-auto rounded-[1.2rem] pr-2">
            {ideaListItems.map((item) => (
              <Link
                key={item.slug}
                href={`/ideas/${item.slug}`}
                className="flex w-full items-start gap-4 rounded-[1.1rem] border border-transparent px-4 py-4 text-left transition hover:border-white/10 hover:bg-white/6"
              >
                <span
                  className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: colorForTag(item.tag), boxShadow: `0 0 18px ${colorForTag(item.tag)}` }}
                />
                <div className="min-w-0 flex-1 border-b border-white/6 pb-4">
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      {item.time}
                    </span>
                    <span className="text-xs text-[color:var(--muted)]">{item.tag}</span>
                  </div>
                  <p className="mt-2 truncate text-lg font-semibold text-[color:var(--foreground)]">
                    {item.title}
                  </p>
                  {item.subtitle ? (
                    <p className="mt-1 truncate text-sm text-[color:var(--muted)]">{item.subtitle}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
