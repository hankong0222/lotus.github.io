export default function About() {
  return (
    <section id="about" data-particle-mode="about" className="px-4 py-10 md:py-16">
      <div className="section-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card rounded-[2rem] p-6 md:p-8">
          <p className="section-kicker">About</p>
          <h2 className="section-title mt-4">Background, research interests, direction, and core skills.</h2>
          <p className="mt-4 text-sm leading-6 text-[color:var(--text-muted)]">
            I am currently studying Computer Science in the Mathematical and Physical Sciences stream at the University of Toronto.
          </p>
        </div>
        <div className="glass-card rounded-[2rem] p-6 md:p-8">
          <h3 className="text-2xl font-semibold">Background</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
            My work spans AI research, bioinformatics, robotics, tutoring, and community technology support. I like projects where technical depth and human impact matter at the same time.
          </p>

          <h3 className="mt-6 text-2xl font-semibold">Interests</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
            I am especially interested in computer vision, interpretable AI, multimodal systems, accessibility, and the design of tools that help people make better decisions.
          </p>

          <h3 className="mt-6 text-2xl font-semibold">Direction</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
            I want to build research-driven systems for real-world understanding, with a focus on turning complex models into products that are usable, trustworthy, and socially aware.
          </p>

          <h3 className="mt-6 text-2xl font-semibold">Skills</h3>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-muted)]">
            Python, Java, C++, JavaScript, React, Flask, MySQL, Git, LaTeX, machine learning, data visualization, LangChain, and collaborative research workflows.
          </p>
        </div>
      </div>
    </section>
  );
}

