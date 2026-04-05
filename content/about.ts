export type SkillBubble = {
  label: string;
  group: string;
  detail: string;
  color: string;
  size: "sm" | "md" | "lg";
};

const machineLearningColor = "#7dd3fc";
const modelingColor = "#fda4af";
const dataColor = "#facc15";
const languageColor = "#86efac";
const toolsColor = "#c4b5fd";

export const skillBubbles: SkillBubble[] = [
  {
    label: "Reinforcement Learning",
    group: "Machine Learning & AI",
    detail: "Exploring decision-making under uncertainty in dynamic systems.",
    color: machineLearningColor,
    size: "md",
  },
  {
    label: "Natural Language Processing (NLP)",
    group: "Machine Learning & AI",
    detail: "Modeling user behavior, feedback, and sequential interaction.",
    color: machineLearningColor,
    size: "md",
  },
  {
    label: "Computer Vision",
    group: "Machine Learning & AI",
    detail: "Detecting, tracking, and reconstructing motion from visual data.",
    color: machineLearningColor,
    size: "md",
  },
  {
    label: "Multimodal Systems",
    group: "Machine Learning & AI",
    detail: "Integrating visual and textual signals for structured understanding.",
    color: machineLearningColor,
    size: "md",
  },
  {
    label: "Representation Learning",
    group: "Machine Learning & AI",
    detail: "Learning embeddings that capture structure and temporal change.",
    color: machineLearningColor,
    size: "sm",
  },
  {
    label: "Trajectory Modeling",
    group: "Modeling & Systems",
    detail: "Reconstructing and predicting motion under noisy observations.",
    color: modelingColor,
    size: "md",
  },
  {
    label: "Physics-informed Modeling",
    group: "Modeling & Systems",
    detail: "Incorporating simple physical constraints to stabilize predictions.",
    color: modelingColor,
    size: "md",
  },
  {
    label: "Decision Systems",
    group: "Modeling & Systems",
    detail: "Designing pipelines that map signals into consistent actions.",
    color: modelingColor,
    size: "sm",
  },
  {
    label: "Sequential / Temporal Modeling",
    group: "Modeling & Systems",
    detail: "Modeling change over time in dynamic and uncertain environments.",
    color: modelingColor,
    size: "md",
  },
  {
    label: "Pipeline Design",
    group: "Modeling & Systems",
    detail: "Building end-to-end systems from perception to prediction.",
    color: modelingColor,
    size: "sm",
  },
  {
    label: "Benchmark Design",
    group: "Data & Evaluation",
    detail: "Evaluating robustness under degraded or compressed inputs.",
    color: dataColor,
    size: "md",
  },
  {
    label: "Experimental Design",
    group: "Data & Evaluation",
    detail: "Designing controlled experiments to analyze system behavior.",
    color: dataColor,
    size: "sm",
  },
  {
    label: "Performance Analysis",
    group: "Data & Evaluation",
    detail: "Interpreting model behavior beyond raw metrics.",
    color: dataColor,
    size: "sm",
  },
  {
    label: "Data Processing",
    group: "Data & Evaluation",
    detail: "Cleaning, structuring, and transforming real-world data.",
    color: dataColor,
    size: "sm",
  },
  {
    label: "Python",
    group: "Languages & Databases",
    detail: "Building ML pipelines, data processing, and system prototypes.",
    color: languageColor,
    size: "sm",
  },
  {
    label: "Java",
    group: "Languages & Databases",
    detail: "Developing structured applications and system logic.",
    color: languageColor,
    size: "sm",
  },
  {
    label: "C++",
    group: "Languages & Databases",
    detail: "Implementing performance-critical components and algorithms.",
    color: languageColor,
    size: "sm",
  },
  {
    label: "SQL / MySQL",
    group: "Languages & Databases",
    detail: "Managing and querying structured data efficiently.",
    color: languageColor,
    size: "sm",
  },
  {
    label: "PyTorch",
    group: "Tools",
    detail: "Implementing and training deep learning models.",
    color: toolsColor,
    size: "sm",
  },
  {
    label: "Git",
    group: "Tools",
    detail: "Version control and collaborative development.",
    color: toolsColor,
    size: "sm",
  },
  {
    label: "LaTeX",
    group: "Tools",
    detail: "Writing technical documents and research reports.",
    color: toolsColor,
    size: "sm",
  },
  {
    label: "VS Code",
    group: "Tools",
    detail: "Development, debugging, and project organization.",
    color: toolsColor,
    size: "sm",
  },
];
