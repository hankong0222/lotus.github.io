import SkillBubbles from "@/components/SkillBubbles";

export default function About() {
  return (
    <section id="about" data-particle-mode="about" className="px-4 py-10 md:py-16">
      <div className="section-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card rounded-[2rem] p-6 md:p-8">
          <p className="section-kicker">About</p>
          <h2 className="section-title mt-4">About Me</h2>

          <h3 className="mt-6 text-2xl font-semibold text-[color:var(--accent-deep)]">Background</h3>
          <p className="mt-4 text-sm leading-6 text-[color:var(--foreground)]">
            Computer Science and Math @ University of Toronto
            <br />
            Physics Minor
            <br />
            From Jinan, China
            <br />
            Researcher @ Tsinghua University
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-[color:var(--accent-deep)]">Interests</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]">
            I&apos;m interested in computer vision, machine learning, and system design, especially in real-world settings with uncertainty.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-[color:var(--accent-deep)]">How I Work</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]">
            I usually start by learning from papers and existing work, then build my own ideas on top of that.
            <br />
            Most of my projects are driven by curiosity. I explore problems that I find interesting and try to turn them into working systems.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-[color:var(--accent-deep)]">Direction</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]">
            More broadly, I&apos;m interested in building things out of curiosity. I don&apos;t see AI as an end goal, but as a set of tools that allow me to explore ideas and create systems that wouldn&apos;t exist otherwise.
            <br />
            In the long term, I&apos;m drawn to building systems that can operate reliably in dynamic and uncertain environments.
          </p>
        </div>

        <div className="glass-card rounded-[2rem] p-6 md:p-8">
          <h3 className="mt-6 text-2xl font-semibold">Skills</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
            Different bubbles reflect different parts of how I work. Move closer to explore focus areas and hover to reveal more detail.
          </p>
          <SkillBubbles />
        </div>
      </div>
    </section>
  );
}
