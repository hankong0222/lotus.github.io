export type Project = {
  id: string;
  githubUrl: string;
  previewAsset?: string;
  title: string;
  summary: string;
  stack: string[];
};

export type Note = {
  id: string;
  title: string;
  body: Array<{
    title: string;
    content: string;
  }>;
};

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
  heroImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  pages: IdeaPage[];
};

export const ideaListTags: Array<{ label: IdeaListTag; color: string }> = [
  { label: "Exploring", color: "#8b5cf6" },
  { label: "In progress", color: "#22c55e" },
  { label: "Idea", color: "#f59e0b" },
  { label: "Archived", color: "#94a3b8" },
];
