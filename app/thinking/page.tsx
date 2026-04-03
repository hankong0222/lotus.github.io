import { thinkingEssays } from "@/lib/site-content";

export default function ThinkingPage() {
  return (
    <main data-particle-mode="thinking" className="px-4 py-10 md:py-16">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="section-kicker">How I Think</p>
          <h1 className="section-title mt-4">Short essays, opinions, and system thinking.</h1>
        </div>

        <div className="mt-10 grid gap-6">
          {thinkingEssays.map((essay) => (
            <article key={essay.slug} className="glass-card rounded-[2rem] p-6 md:p-8">
              <h2 className="mt-3 text-2xl font-semibold">{essay.title}</h2>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
