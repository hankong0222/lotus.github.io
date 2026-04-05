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
  tag: string;
  summary: string;
};
