import Link from "next/link";
import { notFound } from "next/navigation";
import { featuredProjects } from "@/lib/site-content";

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = featuredProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main data-particle-mode="detail" className="px-4 py-10 md:py-16">
      <div className="section-shell">
        <div className="glass-card rounded-[2rem] px-6 py-8 md:px-10 md:py-12">
          <p className="section-kicker">{project.category}</p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <h1 className="section-title">{project.title}</h1>
            <p className="text-sm text-[color:var(--muted)]">{project.year}</p>
          </div>
          <p className="section-copy mt-6 max-w-3xl text-base md:text-lg">{project.summary}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-card rounded-[2rem] p-6 md:p-8">
            <p className="section-kicker">Challenge</p>
            <p className="section-copy mt-4">{project.challenge}</p>

            <p className="section-kicker mt-8">Approach</p>
            <p className="section-copy mt-4">{project.approach}</p>

            <p className="section-kicker mt-8">Outcome</p>
            <p className="section-copy mt-4">{project.outcome}</p>
          </section>

          <aside className="grid gap-6">
            <div className="glass-card rounded-[2rem] p-6">
              <p className="section-kicker">Stack</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-full bg-[color:var(--surface)] px-3 py-1 text-xs font-medium text-[color:var(--muted)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-6">
              <p className="section-kicker">Highlights</p>
              <div className="mt-4 space-y-3">
                {project.metrics.map((metric) => (
                  <p key={metric} className="text-sm leading-6 text-[color:var(--muted)]">
                    {metric}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <Link href="/projects" className="text-sm font-semibold">
            All projects {"->"}
          </Link>
          <Link href="/" className="text-sm font-semibold text-[color:var(--muted)]">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
