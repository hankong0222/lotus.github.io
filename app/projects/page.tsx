import { featuredProjects } from "@/lib/site-content";

export default function ProjectsPage() {
  return (
    <main data-particle-mode="projects" className="px-4 py-10 md:py-16">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="section-kicker">Projects</p>
          <h1 className="section-title mt-4">A deeper look at selected work in AI, accessibility, multimodal products, and robotics.</h1>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <article key={project.slug} className="glass-card rounded-[2rem] p-6">
              <p className="text-sm text-[color:var(--muted)]">{project.category} - {project.year}</p>
              <h2 className="mt-4 text-2xl font-semibold">{project.title}</h2>
              <p className="mt-4 text-sm leading-6 text-[color:var(--text-muted)]">{project.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}


