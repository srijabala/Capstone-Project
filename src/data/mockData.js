export const KPI_DATA = [
  {
    id: "match-score",
    title: "Avg. Profile Match",
    value: "84%",
    change: "+4.2% this week",
    isPositive: true,
    icon: "Compass",
    color: "from-indigo-500 to-cyan-500"
  },
  {
    id: "active-applications",
    title: "Active Applications",
    value: "12",
    change: "+2 new matches",
    isPositive: true,
    icon: "Briefcase",
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: "skills-acquired",
    title: "Skills In Progress",
    value: "4 / 6",
    change: "Next: TypeScript Advanced",
    isPositive: true,
    icon: "Award",
    color: "from-cyan-500 to-blue-500"
  }
];

export const RECOMMENDED_JOBS = [
  {
    id: "job-1",
    role: "Senior React Developer",
    company: "Vercel",
    location: "Remote (US)",
    matchScore: 96,
    salary: "$140k - $180k",
    skillsMatched: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    skillsMissing: ["GraphQL"]
  },
  {
    id: "job-2",
    role: "Frontend Engineer (Framer Motion Specialist)",
    company: "Linear",
    location: "Remote (Global)",
    matchScore: 92,
    salary: "$120k - $150k",
    skillsMatched: ["React", "Framer Motion", "CSS Gradients", "TypeScript"],
    skillsMissing: ["WebGL"]
  },
  {
    id: "job-3",
    role: "Fullstack Engineer",
    company: "Stripe",
    location: "San Francisco, CA / Hybrid",
    matchScore: 85,
    salary: "$160k - $200k",
    skillsMatched: ["React", "TypeScript", "Node.js"],
    skillsMissing: ["PostgreSQL", "Docker"]
  },
  {
    id: "job-4",
    role: "UI Engineer",
    company: "Duolingo",
    location: "Pittsburgh, PA / Hybrid",
    matchScore: 78,
    salary: "$110k - $140k",
    skillsMatched: ["React", "Tailwind CSS", "Figma"],
    skillsMissing: ["React Native"]
  }
];

export const SKILL_PATH = [
  {
    name: "React & State Architecture",
    status: "completed",
    description: "Deep dive into Context API, Redux Toolkit, and performance optimization."
  },
  {
    name: "TypeScript Integration",
    status: "completed",
    description: "Type safety, advanced generics, utility types, and compiler configuration."
  },
  {
    name: "Tailwind CSS & Design Systems",
    status: "completed",
    description: "Creating highly customized responsive layouts, component libraries, and plugins."
  },
  {
    name: "Animation & Framer Motion",
    status: "in-progress",
    description: "Gestures, layout transitions, exit animations, and keyframes."
  },
  {
    name: "System Design & Testing",
    status: "planned",
    description: "Unit testing with Vitest & React Testing Library, frontend caching, and CDN optimization."
  },
  {
    name: "GraphQL & Real-time APIs",
    status: "planned",
    description: "Apollo Client, mutations, queries, and real-time subscription management."
  }
];

export const RECENT_ACTIVITIES = [
  {
    id: "act-1",
    type: "application",
    text: "Applied to Vercel (Senior React Developer)",
    time: "2 hours ago"
  },
  {
    id: "act-2",
    type: "skill",
    text: "Completed Tailwind CSS & Design Systems course",
    time: "Yesterday"
  },
  {
    id: "act-3",
    type: "interview",
    text: "Interview scheduled with Linear (Technical Round)",
    time: "2 days ago"
  },
  {
    id: "act-4",
    type: "match",
    text: "Profile match score increased by 4% after updating skills",
    time: "3 days ago"
  }
];
