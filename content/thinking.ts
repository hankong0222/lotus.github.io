import type { Note } from "@/content/types";

export const thinkingEssays: Note[] = [
  {
    id: "research-to-product",
    title: "Better Models Won't Fix Bad Data",
    body: [
      {
        title: "Claim",
        content:
          "System quality usually breaks upstream first: in data quality, signal design, labeling assumptions, and task framing, not only in model strength.",
      },
      {
        title: "Why I care",
        content:
          "I keep returning to the idea that stronger models can amplify a system, but they rarely repair a weak foundation. Good products need better structure before bigger models.",
      },
    ],
  },
  {
    id: "learning-across-domains",
    title: "Learning Across AI, Bioinformatics, and Robotics",
    body: [
      {
        title: "Pattern",
        content:
          "Working across very different domains has made me care less about surface vocabulary and more about recurring structure: signals, constraints, uncertainty, intervention, and feedback.",
      },
      {
        title: "Takeaway",
        content:
          "Once those patterns become visible, moving between fields feels less like switching topics and more like translating systems.",
      },
    ],
  },
  {
    id: "teaching-and-building",
    title: "Teaching Makes Me Build Better",
    body: [
      {
        title: "Observation",
        content:
          "Teaching exposes where an explanation still depends on jargon, hidden assumptions, or intuition that never became explicit.",
      },
      {
        title: "Design consequence",
        content:
          "That habit carries directly into building. The more carefully I think about legibility and explanation, the better I get at shaping tools that feel understandable instead of merely functional.",
      },
    ],
  },
];
