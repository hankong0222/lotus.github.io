import Image from "next/image";
import portrait from "@/asset/half.jpg";
import IdeasList from "@/components/IdeasList";
import ProjectCarousel from "@/components/ProjectCarousel";
import { featuredProjects } from "@/content/projects";
import { thinkingEssays } from "@/content/thinking";

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
            <h1 className="mt-4 max-w-3xl leading-[0.95] font-semibold tracking-[-0.06em]">
              <span className="text-[clamp(2.2rem,5vw,4.2rem)]">Hi, I&apos;m</span>
              <br />
              <span className="text-[clamp(3rem,7vw,6.4rem)] text-[color:var(--accent-deep)]">Lotus Kong</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[color:var(--foreground)]">
              I&apos;m researching AI systems combining vision, physics, and reasoning.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">
              Computer Science & Mathematics @ University of Toronto
              <br />
              Physics Minor
              <br />
              Researcher @ Tsinghua University
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
              <span className="rounded-full bg-[color:var(--surface)] px-4 py-2 text-[color:var(--muted)]">Applied AI</span>
              <span className="rounded-full bg-[color:var(--surface)] px-4 py-2 text-[color:var(--muted)]">Computer Vision</span>
              <span className="rounded-full bg-[color:var(--surface)] px-4 py-2 text-[color:var(--muted)]">Physics Informed</span>
              <span className="rounded-full bg-[color:var(--surface)] px-4 py-2 text-[color:var(--muted)]">AD System</span>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-4 md:p-5">
            <div className="relative overflow-hidden rounded-[1.6rem] bg-[color:var(--surface)]">
              <Image
                src={portrait}
                alt="Portrait of Lotus Kong"
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section id="projects" data-particle-mode="projects" className="px-4 py-10 md:py-16">
        <div className="section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">Featured Projects</p>
              <h2 className="section-title mt-4">Curiosity-driven projects.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
                The rail below drifts automatically. Move your cursor onto it to pause and inspect a project.
              </p>
            </div>
          </div>

          <ProjectCarousel projects={featuredProjects.slice(0, 4)} />
        </div>
      </section>

      <section id="ideas" data-particle-mode="ideas" className="px-4 py-10 md:py-16">
        <div className="section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">Research & Explorations</p>
              <h2 className="section-title mt-4">Ongoing research, ideas, and questions shaping my work.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[color:var(--muted)]">
                Scroll through the list to see more notes, then click any entry to open the full detail.
              </p>
            </div>
          </div>
          <IdeasList />
        </div>
      </section>

      <section id="thinking" data-particle-mode="thinking" className="px-4 py-10 md:py-16">
        <div className="section-shell">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">How I Think</p>
              <h2 className="section-title mt-4">How I connect research practice, building, and teaching.</h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {thinkingEssays.map((essay) => (
              <article key={essay.id} className="glass-card rounded-[2rem] p-6">
                <p className="text-sm text-[color:var(--muted)]">{essay.tag}</p>
                <h3 className="mt-3 text-2xl font-semibold">{essay.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[color:var(--text-muted)]">{essay.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
