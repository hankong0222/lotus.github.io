import { IdeaListItem } from "./types";

export const ideaListItems: IdeaListItem[] = [
  {
    slug: "evaluation-MLLM-Understanding-Under-Compressed-Vision",
    time: "Apr 2026",
    title: "Evaluating Multimodal Understanding Under Compressed Visual Inputs",
    subtitle: "Ongoing research in Tsinghua University",
    tag: "In progress",
    pages: [
      {
        title: "Problem",
        body: [
          "Multimodal systems are typically evaluated under ideal input conditions, while real-world deployments often involve compressed or degraded visual data.",
        ],
      },
      {
        title: "Observation",
        body: [
          "Compression affects visual fidelity in non-uniform ways, and its impact on downstream understanding is not well characterized. In some cases, models remain robust despite degradation, while in others, performance drops inconsistently across tasks. ",
        ],
      },
      {
        title: "Idea",
        body: [
          "I’m interested in studying how compression influences multimodal understanding across different tasks and modalities. This involves designing a benchmark framework that systematically varies input quality and evaluates its effect on semantic performance.",
        ],
      },
      {
        title: "Question",
        body: [
          "How can evaluation protocols capture meaningful changes in understanding under degraded inputs, rather than only measuring raw performance differences?",
        ],
      },
    ],
  },
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
          "Real-world trajectory prediction is inherently noisy and partially observable. In basketball scenarios, the ball is frequently occluded, detections are unstable, and motion is influenced by both physical dynamics and player interactions. Most existing approaches assume clean observations or treat trajectory prediction as a curve fitting problem, which fails under real-world conditions.",
        ],
      },
      {
        title: "Approach",
        body: [
          "I am exploring a physics-informed framework that combines vision-based perception with structured modeling of motion dynamics.",
          "The system is designed as a two-stage process:",
          "1. Reconstructing trajectories from noisy detections",
          "2. Predicting future motion under physical constraints",
          "Rather than relying solely on learned models, this approach integrates physical priors to improve robustness and consistency.",
        ],
      },
      {
        title: "Why it matters",
        body: [
          "Trajectory prediction is not only about estimating future positions, but about understanding the underlying structure of motion.",
          "In real-world environments, reliable prediction requires bridging perception, temporal reasoning, and physical constraints.",
          "This problem extends beyond sports and is relevant to robotics, autonomous systems, and any setting where decisions depend on incomplete observations.",
        ],
      },
      {
        title: "Current Direction",
        body: [
          "I am building a modular pipeline that connects:",
          "1. object detection and motion extraction",
          "2. trajectory smoothing and reconstruction",
          "3. physics-aware prediction",
          "I am also interested in extending this work toward multi-agent settings, where prediction must account for interactions and intent.",
        ],
      },
    ],
  },
  {
    slug: "signature-based-detection-of-subtle-cloud-attacks",
    time: "Mar 2026",
    title: "Signature-Based Detection of Subtle Cloud Attacks",
    subtitle: "PRISM proposal",
    tag: "Archived",
    heroImage: {
      src: "/PRISM.png",
      alt: "PRISM framework overview for signature-based detection of subtle cloud attacks",
      caption: "PRISM proposal overview.",
    },
    pages: [
      {
        title: "Problem",
        body: [
          "Cloud environments are vulnerable to subtle attacks such as EDoS, which exploit auto-scaling and pay-per-use mechanisms while mimicking normal user behavior.",
        ],
      },
      {
        title: "Observation",
        body: [
          "Traditional detection methods struggle with these attacks due to their low-rate, evolving nature.",
          "At the same time, cloud systems generate rich telemetry signals (e.g., resource usage, request patterns) that can potentially be leveraged for detection.",
        ],
      },
      {
        title: "Approach",
        body: [
          "The proposal explores a signature-based detection framework that combines request-level features with system-level metrics.",
          "A supervised machine learning model is iteratively refined using feature importance and performance feedback to improve detection accuracy.",
        ],
      },
      {
        title: "Evaluation",
        body: [
          "The system is tested in a simulated cloud environment, comparing performance against existing detection methods using metrics such as precision, recall, and F1-score."
        ],
      },
    ],
  },
  {
    slug: "dynamic-resource-allocation-from-structured-anomaly-signals",
    time: "Mar 2026",
    title: "Dynamic Resource Allocation from Structured Anomaly Signals",
    tag: "Idea",
    pages: [
      {
        title: "Problem",
        body: [
          "Anomaly detection systems typically output scalar scores, but these signals are not directly actionable for system-level decisions such as resource allocation."
        ],
      },
      {
        title: "Observation",
        body: [
          "Continuous anomaly scores are often unstable and sensitive to noise, making it difficult to define consistent decision boundaries.",
          "This leads to reactive or inconsistent allocation strategies."
        ],
      },
      {
        title: "Idea",
        body: [
          "I’m interested in structuring anomaly signals into intervals, where different score ranges correspond to distinct system states.",
          "Instead of reacting to raw scores, the system can map intervals to allocation strategies, enabling more stable and interpretable decisions."
        ],
      },
      {
        title: "Direction",
        body: [
          "This suggests a pipeline where:",
          "1. detection produces anomaly scores",
          "2. scores are discretized into intervals",
          "3. each interval triggers a resource allocation policy",
          "",
          "The allocation strategy can then be optimized dynamically, balancing cost, robustness, and system performance."
        ],
      },
      {
        title: "Question",
        body: [
          "How can we design interval-based representations of anomaly signals that enable stable and adaptive decision-making in dynamic systems?"
        ],
      }
    ],
  },
  {
    slug: "better-me-research",
    time: "Jan 2026",
    title: "Measuring Progress in NLP-Based Feedback Systems",
    tag: "Idea",
    pages: [
      {
        title: "Problem",
        body: [
          "In many NLP-driven systems (e.g., feedback generation, assessment tools), progress is often evaluated using static metrics such as scores or discrete labels, which fail to capture how users improve over time.",
        ],
      },
      {
        title: "Observation",
        body: [
          "User progress in language and behavior is inherently sequential and context-dependent. Improvements are reflected in patterns of change — such as consistency, adaptation, and response to feedback — rather than isolated outputs.",
        ],
      },
      {
        title: "Idea",
        body: [
          "I’m interested in modeling progress as a temporal process, where NLP outputs (e.g., user responses, reflections, or interactions) are treated as evolving sequences. Instead of evaluating individual outputs, the system could learn representations of user trajectories and quantify progress based on changes in these representations over time.",
        ],
      },
      {
        title: "Question",
        body: [
          "How can we design learning-based metrics that capture meaningful progress from sequential, noisy, and context-dependent NLP data?",
        ],
      },
    ],
  },
  {
    slug: "nmp-compression",
    time: "Sep 2025",
    title: "Neural Map Priors Under Communication Constraints",
    subtitle: "Ongoing research in Tsinghua University",
    tag: "In progress",
    pages: [
      {
        title: "Problem",
        body: [
          "Neural map-based systems rely on exchanging and updating shared representations, but real-world deployment often involves bandwidth and communication constraints.",
        ],
      },
      {
        title: "Observation",
        body: [
          "Global priors are typically treated as fully accessible and high-fidelity, while in practice they may need to be compressed or partially transmitted.",
          "This introduces a trade-off between information fidelity and communication efficiency.",
        ],
      },
      {
        title: "Idea",
        body: [
          "I’m interested in studying how compression affects the effectiveness of neural map priors.",
          "Instead of assuming full access to global representations, the system could operate on compressed or selectively transmitted features.",
        ],
      },
      {
        title: "Question",
        body: [
          "How can we design a End-to-End Autonomous Driving System that remain informative under compression, while supporting efficient communication and consistent updates?",
        ],
      },
    ],
  },
  
];

export function getIdeaBySlug(slug: string) {
  return ideaListItems.find((item) => item.slug === slug);
}

