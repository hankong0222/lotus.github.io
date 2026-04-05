export default function Footer() {
  return (
    <footer id="contact" className="px-4 pb-10 pt-4 md:pb-14">
      <div className="section-shell">
        <div className="glass-card rounded-[2rem] px-6 py-8 md:px-10 md:py-12">
          <p className="section-kicker">Contact</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Open to internships and research roles in AI, computer vision, and intelligent systems.
          </h2>
          <div className="mt-6 grid gap-3 text-sm text-[color:var(--foreground)]">
            <a
              href="mailto:hankong0222@126.com"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--surface)] px-4 py-2 transition hover:text-[color:var(--accent-deep)]"
            >
              <span className="text-[color:var(--muted)]">Email</span>
              <span>hankong0222@126.com</span>
            </a>
            <a
              href="https://github.com/hankong0222"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--surface)] px-4 py-2 transition hover:text-[color:var(--accent-deep)]"
            >
              <span className="text-[color:var(--muted)]">GitHub</span>
              <span>github.com/hankong0222</span>
            </a>
            <a
              href="https://www.linkedin.com/in/lotus-kong-aa7321329"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--surface)] px-4 py-2 transition hover:text-[color:var(--accent-deep)]"
            >
              <span className="text-[color:var(--muted)]">LinkedIn</span>
              <span>linkedin.com/in/lotus-kong-aa7321329</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
