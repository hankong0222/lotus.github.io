import type { Note } from "@/content/types";

export const thinkingEssays: Note[] = [
  {
    id: "data-vs-models",
    title: "Better Models Won't Fix Bad Data",
    pages: [
      {
        title: "Claim",
        body: [
          "In many systems, performance is limited less by model architecture and more by data quality.",
        ],
      },
      {
        title: "Why I care",
        body: [
          "Models can only learn from what they see.",
          "If the data is noisy, incomplete, or misaligned with the task, improvements in model design often yield diminishing returns.",
        ],
      },
      {
        title: "Insight",
        body: [
          "In trajectory prediction, unstable detections directly lead to poor reconstruction, regardless of how strong the downstream model is.",
          "Similarly, in multimodal settings, compressed or degraded inputs can significantly affect understanding."
        ]
      },
      {
        title: "Takeaway",
        body: [
          "I tend to treat data quality and representation as first-order problems, rather than relying on increasingly complex models to compensate for weak inputs."
        ]
      }
    ],
  },
  {
    id: "detection-vs-understanding",
    title: "Detection is Easy, Understanding is Hard",
    pages: [
      {
        title: "Claim",
        body: [
          "Many systems stop at detection, but real problems begin after that.",
        ],
      },
      {
        title: "Why",
        body: [
          "Detection answers what is happening, but understanding requires explaining structure, causality, and what should happen next.",
        ],
      },
      {
        title: "Insight",
        body: [
          "In trajectory prediction, detecting the object is relatively straightforward.",
          "The challenge lies in reconstructing motion under noise, partial observation, and physical constraints.",
        ],
      },
      {
        title: "Takeaway",
        body: [
          "I focus less on detecting signals, and more on modeling what they mean and how they should be used."
        ]
      }
    ],
  },
  {
    id: "signals-vs-decisions",
    title: "Signals Are Not Decisions",
    pages: [
      {
        title: "Claim",
        body: [
          "Model outputs are often treated as decisions, but they are only signals.",
        ],
      },
      {
        title: "Why",
        body: [
          "Predictions, scores, or classifications do not directly translate into actions.",
          "In real systems, decisions require stability, context, and clear boundaries."
        ],
      },
      {
        title: "Insight",
        body: [
          "In anomaly detection, small fluctuations in scores can lead to inconsistent responses.",
          "Without structure, the same signal may trigger different actions under similar conditions."
        ]
      },
      {
        title: "Takeaway",
        body: [
          "I focus on how signals are transformed into decisions — designing representations and structures that enable consistent and actionable behavior."
        ]
      }
    ],
  },
  {
    id: "evaluation-vs-optimization",
    title: "Evaluation Defines What Matters",
    pages: [
      {
        title: "Claim",
        body: [
          "A model is only as useful as how it is evaluated.",
        ],
      },
      {
        title: "Why",
        body: [
          "Many systems show strong performance under controlled or simulated settings, but fail to translate to real-world environments."
        ],
      },
      {
        title: "Insight",
        body: [
          "In studying system design and security problems, I’ve seen that results based on synthetic or simplified data often overlook the complexity of real-world behavior.",
          "This creates a gap between reported performance and actual usability."
        ]
      },
      {
        title: "Takeaway",
        body: [
          "I focus on evaluation as a first-class problem — designing settings and metrics that reflect real-world conditions, not just idealized scenarios."
        ]
      }
    ],
  },
    {
    id: "about-dream",
    title: "Building What I Want to See",
    pages: [
      {
        title: "Claim",
        body: [
          "I’m driven less by outcomes, and more by the desire to build things I genuinely want to see exist.",
        ],
      },
      {
        title: "Why",
        body: [
          "Many of my decisions have been consistent over time, shaped by long-term interest rather than short-term goals.",
          "I was drawn to mathematics early on, then to physics, and later to building systems — not because of external pressure, but because I found them inherently interesting."
        ],
      },
      {
        title: "Insight",
        body: [
          "What matters to me is not just solving predefined problems, but creating new ones — shaping directions where curiosity and structure meet.",
          "AI, to me, is not the goal, but a set of tools that expand what I can build."
        ]
      },
      {
        title: "Takeaway",
        body: [
          "I’m interested in building systems that reflect both structure and creativity — where technical rigor and personal curiosity come together."
        ]
      }
    ],
  },
];
