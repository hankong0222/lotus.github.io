"use client";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#ideas", label: "Ideas" },
  { href: "#thinking", label: "Thinking" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="section-shell glass-card flex items-center justify-between rounded-full px-5 py-3">
        <a href="#home" className="text-sm font-semibold tracking-[0.3em] uppercase">
          Lotus Kong
        </a>
        <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[color:var(--foreground)]">
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full bg-[color:var(--foreground)] px-4 py-2 text-sm font-medium text-[color:var(--background)] transition hover:translate-y-[-1px]"
        >
          Contact
        </a>
      </div>
    </header>
  );
}

