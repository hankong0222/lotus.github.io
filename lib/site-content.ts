export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  stack: string[];
  metrics: string[];
};

export type Note = {
  slug: string;
  title: string;
  tag: string;
  summary: string;
};

export const featuredProjects: Project[] = [
  {
    slug: "signal-workbench",
    title: "Signal Workbench",
    category: "Research Tooling",
    year: "2026",
    summary:
      "A browser-based workspace for comparing model outputs, annotating edge cases, and turning raw findings into reusable evaluation prompts.",
    challenge:
      "Research sessions were scattered across docs, screenshots, and ad-hoc scripts, which made it difficult to compare iterations with confidence.",
    approach:
      "I designed a modular review flow with prompt snapshots, side-by-side comparisons, and lightweight annotation primitives to keep evaluation close to the source material.",
    outcome:
      "The system reduced synthesis time, clarified experiment history, and made discussion with collaborators more concrete and reproducible.",
    stack: ["Next.js", "TypeScript", "Design Systems", "Structured Evaluation"],
    metrics: ["4x faster review loops", "Shared annotation model", "Reusable prompt audit trail"],
  },
  {
    slug: "field-notes-atlas",
    title: "Field Notes Atlas",
    category: "Knowledge Interface",
    year: "2025",
    summary:
      "A map-like interface for browsing fragmented observations, references, and speculative links between them.",
    challenge:
      "Interesting notes often stayed isolated, which meant insights were hard to revisit or connect into larger themes.",
    approach:
      "I built a spatial browsing experience that treats notes as clusters instead of flat entries, encouraging pattern recognition and conceptual drift.",
    outcome:
      "The project turned a personal archive into a navigable thinking environment and created a stronger bridge between note-taking and publishing.",
    stack: ["React", "Content Architecture", "Interaction Design"],
    metrics: ["Non-linear browsing model", "Pattern-first information design", "Ready for editorial expansion"],
  },
  {
    slug: "quiet-systems-lab",
    title: "Quiet Systems Lab",
    category: "Editorial Platform",
    year: "2025",
    summary:
      "A writing-first website for essays on product judgment, interface clarity, and long-horizon technical thinking.",
    challenge:
      "Most publishing tools are optimized for throughput, not for building a clear intellectual identity or a durable reading experience.",
    approach:
      "I focused on typography, pacing, and structure, then paired the editorial layer with a minimal publishing workflow that keeps attention on ideas.",
    outcome:
      "The result is a platform that feels slower, more intentional, and better aligned with reflective technical writing.",
    stack: ["Next.js", "Editorial Design", "MDX-ready Architecture"],
    metrics: ["Reader-friendly pacing", "Portable content model", "Minimal maintenance overhead"],
  },
  {
    slug: "common-ground-ui",
    title: "Common Ground UI",
    category: "Component System",
    year: "2024",
    summary:
      "A design and implementation system for shared product primitives, documentation patterns, and interface consistency.",
    challenge:
      "Teams were repeatedly rebuilding similar interface patterns with small inconsistencies that accumulated into product friction.",
    approach:
      "I created a component language rooted in constraints, behavior notes, and examples that show why a pattern exists, not just how it looks.",
    outcome:
      "The library improved implementation consistency while making design reasoning easier to transfer across teams.",
    stack: ["React", "Tailwind CSS", "System Documentation"],
    metrics: ["Reusable primitives", "Shared decision language", "Lower UI drift"],
  },
];

export const ideaNotes: Note[] = [
  {
    slug: "interfaces-that-teach",
    title: "Interfaces That Teach",
    tag: "Idea Note",
    summary:
      "A note on designing products that quietly improve the user's judgment instead of merely automating the next click.",
  },
  {
    slug: "memory-as-product-layer",
    title: "Memory as a Product Layer",
    tag: "Research Reflection",
    summary:
      "A reflection on how memory systems change trust, continuity, and the feeling of being understood inside software.",
  },
  {
    slug: "slow-tools-for-serious-work",
    title: "Slow Tools for Serious Work",
    tag: "Exploration",
    summary:
      "A short argument for software that favors orientation, depth, and composure over speed theatre.",
  },
];

export const thinkingEssays: Note[] = [
  {
    slug: "clarity-before-scale",
    title: "Clarity Before Scale",
    tag: "Essay",
    summary:
      "Why product systems usually fail from ambiguous judgment before they fail from technical complexity.",
  },
  {
    slug: "designing-for-interpretability",
    title: "Designing for Interpretability",
    tag: "Opinion",
    summary:
      "What interface designers can learn from research tooling when the goal is not just output, but understanding.",
  },
  {
    slug: "systems-are-social",
    title: "Systems Are Social",
    tag: "System Thinking",
    summary:
      "A piece on how organizational behavior quietly becomes product behavior, whether teams notice it or not.",
  },
];
