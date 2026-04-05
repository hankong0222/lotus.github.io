"use client";

const links = [
  { sectionId: "home", label: "👋Home" },
  { sectionId: "projects", label: "✌️Projects" },
  { sectionId: "ideas", label: "👌Ideas" },
  { sectionId: "thinking", label: "👍Thinking" },
  { sectionId: "about", label: "✊About" },
];

export default function Header() {
  const scrollToSection = (sectionId: string) => () => {
    const scrollElement =
      document.getElementById("app-scroll-root") ?? document.scrollingElement ?? document.documentElement;
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const sectionTop = section.getBoundingClientRect().top - scrollElement.getBoundingClientRect().top;
    scrollElement.scrollTop += sectionTop;
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="section-shell glass-card flex items-center justify-between rounded-full px-5 py-3">
        <button
          type="button"
          onClick={scrollToSection("home")}
          className="text-sm font-semibold tracking-[0.3em] uppercase"
        >
          Lotus Kong
        </button>
        <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
          {links.map((link) => (
            <button
              key={link.sectionId}
              type="button"
              onClick={scrollToSection(link.sectionId)}
              className="transition hover:text-[color:var(--foreground)]"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={scrollToSection("contact")}
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold transition hover:translate-y-[-1px]"
          style={{ color: "#08111d", fontWeight: 700, whiteSpace: "nowrap" }}
        >
          <span style={{ color: "#08111d", display: "inline-block" }}>🤟Contact</span>
        </button>
      </div>
    </header>
  );
}
