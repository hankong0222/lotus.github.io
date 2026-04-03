import { featuredProjects, ideaNotes, thinkingEssays } from "@/lib/site-content";

export default function Home() {
  return (
    <>
      <section
        id="home"
        data-particle-mode="hero"
        className="grain overflow-hidden px-4 pb-8 pt-10 md:pb-12 md:pt-14"
      >
        <div className="section-shell grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-card rounded-[2rem] px-6 py-8 md:px-10 md:py-12">
            <p className="section-kicker">Home</p>
            <h1 className="mt-4 max-w-3xl text-[clamp(2.8rem,7vw,6.4rem)] leading-[0.95] font-semibold tracking-[-0.06em]">
              Hi, I'm <span className="text-[color:var(--accent-deep)]">Lotus</span>
            </h1>
          </div>

        </div>
      </section>

      <section id="projects" data-particle-mode="projects" className="px-4 py-10 md:py-16">
        <div className="section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {featuredProjects.slice(0, 4).map((project) => (
              <article key={project.slug} className="glass-card rounded-[2rem] p-6">
                <h3 className="mt-4 text-2xl font-semibold">{project.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ideas" data-particle-mode="ideas" className="px-4 py-10 md:py-16">
        <div className="section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">Research Preview</p>
              <h2 className="section-title mt-4">Ideas and explorations connected to papers, systems, and open questions.</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {ideaNotes.map((note) => (
              <article key={note.slug} className="glass-card rounded-[2rem] p-6">
                <h3 className="mt-3 text-2xl font-semibold">{note.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="thinking" data-particle-mode="thinking" className="px-4 py-10 md:py-16">
        <div className="section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">Thinking Preview</p>
              <h2 className="section-title mt-4">Short essays, opinions, and system thinking.</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {thinkingEssays.map((essay) => (
              <article key={essay.slug} className="glass-card rounded-[2rem] p-6">
                <h3 className="mt-3 text-2xl font-semibold">{essay.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
