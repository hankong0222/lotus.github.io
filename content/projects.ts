import type { Project } from "@/content/types";

export const featuredProjects: Project[] = [
  {
    id: "basketball-prediction",
    githubUrl: "https://github.com/hankong0222/Baketball-projection-analysis-and-prediction",
    previewAsset: "demo_with_prediction",
    title: "🏀Basketball Trajectory Reconstruction and Prediction",
    summary:
      "A physics-informed vision pipeline for reconstructing and predicting basketball trajectories from noisy real-world observations.",
    stack: ["YOLO", "Physics", "End-to-End", "Visualization"],
  },
  {
    id: "pixel-pet",
    githubUrl: "https://github.com/hankong0222/pixel_pet_ai",
    previewAsset: "pixel_pet",
    title: "🐱Pixel Pet AI——A vision-based interactive desktop pet",
    summary:
      "An interactive vision-based desktop pet that responds to user gestures through real-time perception and animation",
    stack: ["interactive", "HCI", "vision-based", "real-time", "animation"],
  },
  {
    id: "better-me",
    githubUrl: "https://github.com/hankong0222/BetterMe",
    previewAsset: "better_me",
    title: "Better Me——An AI-Assisted Self-Regulation System",
    summary:
      "An AI-assisted system for daily reflection and self-regulation, designed as a continuous feedback loop between user behavior and adaptive guidance.",
    stack: ["system", "feedback loop", "Adaptive"],
  },
  
];
