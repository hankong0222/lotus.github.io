export type IdeaListTag = "Exploring" | "In progress" | "Idea" | "Archived";

export type IdeaPage = {
  title: string;
  body: string[];
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
};

export type IdeaListItem = {
  slug: string;
  time: string;
  title: string;
  subtitle?: string;
  tag: IdeaListTag;
  pages: IdeaPage[];
};

export const ideaListTags: Array<{ label: IdeaListTag; color: string }> = [
  { label: "Exploring", color: "#8b5cf6" },
  { label: "In progress", color: "#22c55e" },
  { label: "Idea", color: "#f59e0b" },
  { label: "Archived", color: "#94a3b8" },
];

export const ideaListItems: IdeaListItem[] = [
  {
    slug: "trajectory-prediction-under-noise-and-partial-observation",
    time: "Apr 2026",
    title: "Trajectory Prediction Under Noise and Partial Observation",
    subtitle: "Ongoing research on structured modeling under incomplete observations",
    tag: "In progress",
    pages: [
      {
        title: "Problem",
        body: [
          "Trajectory prediction is often treated as curve fitting, but this assumption breaks under noisy and incomplete observations.",
        ],
      },
      {
        title: "Observation",
        body: [
          "In basketball scenarios, detections are unstable and frequently missing, leading to fragmented and inconsistent trajectories.",
        ],
      },
      {
        title: "Idea",
        body: [
          "Instead of relying purely on learned models, simple physical constraints may help stabilize reconstruction and prediction.",
        ],
      },
      {
        title: "Question",
        body: [
          "How should perception be combined with structured modeling when observations are incomplete?",
        ],
      },
    ],
  }
  
];

export function getIdeaBySlug(slug: string) {
  return ideaListItems.find((item) => item.slug === slug);
}

