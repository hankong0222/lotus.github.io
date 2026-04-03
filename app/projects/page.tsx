import { featuredProjects } from "@/lib/site-content";

export default function ProjectsPage() {
  return (
    <main data-particle-mode="projects" className="px-4 py-10 md:py-16">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="section-kicker">Projects</p>
          <h1 className="section-title mt-4">A deeper look at selected work.</h1>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <article key={project.slug} className="glass-card rounded-[2rem] p-6">
              <h2 className="mt-4 text-2xl font-semibold">{project.title}</h2>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
