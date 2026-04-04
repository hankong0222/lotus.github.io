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
    slug: "education-ai-platform",
    title: "Education AI Improvement Platform",
    category: "Applied AI Research",
    year: "2025-Present",
    summary:
      "An interpretable AI system that predicts how growth in specific competencies can affect student performance and turns those insights into actionable recommendations for teachers.",
    challenge:
      "Teachers often have fragmented student data but limited support for understanding which skills most strongly influence future learning outcomes.",
    approach:
      "I built a hybrid CNN and MDP modeling pipeline, developed a Flask backend, and deployed a web platform where educators can upload data and receive personalized improvement guidance.",
    outcome:
      "The project translated model output into interpretable visual reports, including heatmaps and radar charts, so recommendations could be discussed and acted on in a classroom context.",
    stack: ["Python", "CNN", "MDP", "Flask", "Data Visualization"],
    metrics: ["Hybrid predictive modeling", "Teacher-facing recommendation workflow", "Interpretable AI diagnostics"],
  },
  {
    slug: "luma-meditation-app",
    title: "LUMA Generative AI Meditation App",
    category: "Generative AI Product",
    year: "2025",
    summary:
      "A web-based meditation experience that combines LLM-guided scripting, speech synthesis, and custom audio playback into a calm, interactive wellness product.",
    challenge:
      "Most AI wellness demos feel disconnected across text, voice, and playback, which makes the experience feel generic instead of immersive.",
    approach:
      "I developed the product with a Flask backend and React frontend, used Cohere for generation, Google Cloud TTS for voice, and validated structured outputs with pydantic before audio rendering.",
    outcome:
      "The result was a full-stack GenAI prototype with smoother playback, stronger prompt reliability, and a more intentional end-to-end user experience.",
    stack: ["React", "Flask", "Cohere", "Google Cloud TTS", "pydantic", "Web Audio API"],
    metrics: ["Structured prompt validation", "Audio post-processing with pydub", "Interactive playback UI"],
  },
  {
    slug: "inclusive-tech-research",
    title: "Inclusive Technology for Older Adults",
    category: "Human-Centered Research",
    year: "2021-Present",
    summary:
      "A long-running community and research effort focused on digital inclusion, usability barriers, and accessible technology design for older adults.",
    challenge:
      "Older adults are often asked to adopt smartphones, internet services, and biometric systems that are not designed with their needs or constraints in mind.",
    approach:
      "I organized annual outreach activities, taught practical mobile and internet skills, and studied usability issues in retinal and fingerprint-based systems to understand accessibility gaps.",
    outcome:
      "This work connected research and service, leading to more inclusive design ideas such as adaptive authentication and more accessible interface patterns.",
    stack: ["User Research", "Accessibility", "Community Outreach", "Biometric Systems"],
    metrics: ["5 yearly outreach activities", "Provincial exhibition representation", "Inclusive authentication concepts"],
  },
  {
    slug: "ftc-robotics-engineering",
    title: "FTC Robotics Engineering",
    category: "Robotics Systems",
    year: "2021-2022",
    summary:
      "A robotics engineering project spanning mechanical design, simulation, autonomous behavior, and sensor-integrated control.",
    challenge:
      "Competition robotics requires rapid iteration across hardware and software while keeping systems reliable enough for real-world performance.",
    approach:
      "I designed and simulated robot components in Fusion 360 and SolidWorks, then programmed autonomous and driver-controlled operations in Java using sensor feedback.",
    outcome:
      "The experience strengthened my systems thinking by connecting CAD, control logic, and real-world debugging into one engineering workflow.",
    stack: ["Java", "Fusion 360", "SolidWorks", "Sensors", "Autonomous Control"],
    metrics: ["Mechanical and software integration", "Autonomous + driver-controlled modes", "Competition-oriented systems design"],
  },
];

export const ideaNotes: Note[] = [
  {
    slug: "interpretable-ai-for-teachers",
    title: "Interpretable AI for Teachers",
    tag: "Research Direction",
    summary:
      "How model outputs become more useful when educators can trace them through visual evidence, competency signals, and concrete intervention suggestions.",
  },
  {
    slug: "inclusive-biometrics",
    title: "Inclusive Biometrics for Aging Populations",
    tag: "Human-Centered Study",
    summary:
      "Questions around retinal and fingerprint sensitivity, usability barriers, and what adaptive authentication should look like in real products.",
  },
  {
    slug: "multimodal-ai-experiences",
    title: "Multimodal AI Experiences That Feel Calm",
    tag: "Product Exploration",
    summary:
      "Exploring how language models, speech synthesis, and interface pacing can work together to create more emotionally coherent AI products.",
  },
];

export const thinkingEssays: Note[] = [
  {
    slug: "research-to-product",
    title: "From Research Insight to Usable Product",
    tag: "Essay",
    summary:
      "I am most interested in the moment when technical models stop being experiments and start becoming tools people can understand and trust.",
  },
  {
    slug: "learning-across-domains",
    title: "Learning Across AI, Bioinformatics, and Robotics",
    tag: "Reflection",
    summary:
      "Working across very different systems has taught me to look for transferable structure: signals, constraints, feedback, and human decision points.",
  },
  {
    slug: "teaching-and-building",
    title: "Teaching Makes Me Build Better",
    tag: "Perspective",
    summary:
      "Tutoring and curriculum support sharpen how I explain complexity, which also improves how I design software for real users.",
  },
];

