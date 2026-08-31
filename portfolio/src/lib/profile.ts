export const profile = {
  name: "Cynthia Hanna",
  role: "Computer Science Student · AI Automation & Business Analysis",
  location: "Beirut, Lebanon",
  email: "cynthiahanna102@gmail.com",
  phone: "+961 71 238 301",
  tagline:
    "I build AI-driven automations, chatbots, and workflow systems — and I'm looking to bring that into a Business Analyst role at an AI-first company.",
  summary:
    "Detail-oriented Computer Science student and aspiring Business Analyst with hands-on experience designing AI-driven automations, chatbots, and end-to-end workflow systems. Skilled in translating business requirements into working technical solutions using n8n workflow automation, Claude AI (connectors, skills, agent building, prompt engineering), and full-stack development. Strong analytical and problem-solving foundation combined with practical experience across the system lifecycle, from requirements gathering to deployment. Adept at cross-functional collaboration, process documentation, and continuously learning new technologies to improve efficiency.",
} as const;

export const skillGroups = [
  {
    title: "AI & Automation",
    skills: [
      "n8n workflow automation",
      "Claude AI (connectors, skills, agents)",
      "Prompt engineering",
      "Chatbot design & development",
      "LLM integration",
    ],
  },
  {
    title: "Business & Analysis",
    skills: [
      "Requirements gathering",
      "Process mapping",
      "Systems documentation",
      "Stakeholder communication",
      "Microsoft Excel & PowerPoint",
    ],
  },
  {
    title: "Technical",
    skills: ["Python", "Java", "C++", "JavaScript", "HTML & CSS", "REST APIs", "Oracle DB"],
  },
  {
    title: "Languages",
    skills: ["Arabic (native)", "English (fluent)", "French (fluent)"],
  },
] as const;

export const experience = [
  {
    title: "IT Support Intern",
    org: "BIMPOS",
    dates: "Jun 2025 – Oct 2025",
    bullets: [
      "Provided technical support and troubleshooting for hardware, software, and network issues, resolving user-reported problems and minimizing downtime.",
      "Assisted with system maintenance and user account management, supporting smooth daily IT operations across the organization.",
      "Gained hands-on experience in customer support and technical problem-solving within a professional business environment.",
    ],
  },
] as const;

export const projects = [
  {
    title: "Personal Portfolio with AI Recruiter Chatbot",
    subtitle: "This site",
    description:
      "This portfolio site, featuring an embedded AI chatbot (the one in the corner!) that answers recruiter questions about my background in real time. The backend runs on n8n, connecting a large language model, conversation memory, and a webhook API to the front end.",
    tags: ["Next.js", "TypeScript", "n8n", "LLM Agent", "Tailwind CSS"],
  },
  {
    title: "AI Career-Matching Platform",
    subtitle: "Personal project",
    description:
      "An AI-based system that analyzes applicant CVs to extract skills, experience, and preferences, then matches candidates to the best-fit roles based on desired position and expected salary. Uses prompt engineering and automation logic to turn unstructured resume data into structured job recommendations.",
    tags: ["n8n", "Prompt Engineering", "Groq LLM", "Automation"],
  },
  {
    title: "Hospital Management Mobile Application",
    subtitle: "Personal project",
    description:
      "A mobile application to improve hospital management and patient care — doctors and patients can securely sign in, manage appointments, and access medical records and lab results. Includes room reservations, specialist selection, multi-method payments, emergency SOS, and staff dashboards.",
    tags: ["Android Studio", "Oracle DB", "REST API"],
  },
] as const;

export const education: {
  degree: string;
  org: string;
  dates: string;
  detail?: string;
}[] = [
  {
    degree: "Bachelor's in Computer Science",
    org: "Lebanese University, Faculty of Sciences, Beirut, Lebanon",
    dates: "2023 – 2026",
    detail: "GPA: 92 / 100",
  },
  {
    degree: "Baccalaureate, General Science",
    org: "Collège Saint Joseph des Sœurs des Saints Cœurs, Ain-Ebel, Lebanon",
    dates: "2020 – 2023",
  },
];

export const leadership: {
  title: string;
  org: string;
  dates: string;
  detail?: string;
}[] = [
  {
    title: "Troop Leader (Cheftaine Éclaireuses)",
    org: "Scouts Du Liban – Saint Georges Rmeich",
    dates: "2024 – Present",
    detail: "Organized camps, hikes, and scouting events for youth groups.",
  },
  {
    title: "Active Member",
    org: "Scouts Du Liban – Saint Georges Rmeich",
    dates: "2011 – Present",
  },
];
