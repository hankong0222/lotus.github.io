import { ideaNotes } from "@/lib/site-content";

export default function IdeasPage() {
  return (
    <main data-particle-mode="ideas" className="px-4 py-10 md:py-16">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="section-kicker">Ideas & Explorations</p>
          <h1 className="section-title mt-4">Working notes, research threads, and open questions I want to keep developing.</h1>
        </div>

        <div className="mt-10 grid gap-6">
          {ideaNotes.map((note) => (
            <article key={note.slug} className="glass-card rounded-[2rem] p-6 md:p-8">
              <p className="text-sm text-[color:var(--muted)]">{note.tag}</p>
              <h2 className="mt-3 text-2xl font-semibold">{note.title}</h2>
              <p className="mt-4 text-sm leading-6 text-[color:var(--text-muted)]">{note.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

