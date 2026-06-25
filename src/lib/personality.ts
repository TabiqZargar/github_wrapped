import { DeveloperPersonality, DeveloperPersonalityType } from "@/types";

const personalities: Record<DeveloperPersonalityType, Omit<DeveloperPersonality, "type">> = {
  "Open Source Hero": {
    description: "You're a community champion. Your repositories have earned stars and recognition, showing the impact of your open-source work.",
    badge: "Community Pillar",
    color: "#EC4899",
    icon: "🦸",
  },
  "Full Stack Nomad": {
    description: "You roam across the full spectrum of development. From frontend to backend, no layer of the stack is unfamiliar to you.",
    badge: "Versatile Engineer",
    color: "#8B5CF6",
    icon: "🌐",
  },
  "Shipping Machine": {
    description: "You ship projects at an impressive pace. Your repository count shows you're always building something new.",
    badge: "Prolific Creator",
    color: "#F59E0B",
    icon: "🚢",
  },
  "Bug Hunter": {
    description: "You're meticulous about quality. Your issue tracking shows a commitment to refining and perfecting your projects.",
    badge: "Quality Guardian",
    color: "#EF4444",
    icon: "🐛",
  },
  "Side Project Addict": {
    description: "You have a diverse portfolio of side projects. Each repository tells a story of curiosity and experimentation.",
    badge: "Idea Machine",
    color: "#10B981",
    icon: "💡",
  },
  "Framework Hopper": {
    description: "You explore the tech landscape with enthusiasm. Multiple languages and frameworks are part of your toolkit.",
    badge: "Tech Explorer",
    color: "#06B6D4",
    icon: "🔀",
  },
  "Community Builder": {
    description: "You attract collaborators and contributors. Your projects have strong communities and active discussions.",
    badge: "Team Catalyst",
    color: "#F97316",
    icon: "🤝",
  },
  "Consistency King": {
    description: "Your account has stood the test of time. Longevity and sustained activity define your GitHub presence.",
    badge: "Iron Will",
    color: "#3B82F6",
    icon: "👑",
  },
  "Code Explorer": {
    description: "You're always venturing into new territory. Your repositories span multiple domains and technologies.",
    badge: "Digital Pioneer",
    color: "#14B8A6",
    icon: "🧭",
  },
};

export function determinePersonality(data: {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  languageDiversity: number;
  accountAge: number;
  openIssuesCount: number;
}): DeveloperPersonality {
  const scores: Record<DeveloperPersonalityType, number> = {
    "Open Source Hero": 0,
    "Full Stack Nomad": 0,
    "Shipping Machine": 0,
    "Bug Hunter": 0,
    "Side Project Addict": 0,
    "Framework Hopper": 0,
    "Community Builder": 0,
    "Consistency King": 0,
    "Code Explorer": 0,
  };

  if (data.totalStars > 500) scores["Open Source Hero"] += 3;
  if (data.totalStars > 100) scores["Open Source Hero"] += 2;
  if (data.totalForks > 100) scores["Community Builder"] += 3;
  if (data.totalForks > 20) scores["Community Builder"] += 2;
  if (data.totalRepos > 30) scores["Shipping Machine"] += 3;
  if (data.totalRepos > 15) scores["Side Project Addict"] += 2;
  if (data.totalRepos > 50) scores["Shipping Machine"] += 2;
  if (data.languageDiversity >= 5) scores["Framework Hopper"] += 3;
  if (data.languageDiversity >= 3) scores["Full Stack Nomad"] += 2;
  if (data.languageDiversity >= 7) scores["Code Explorer"] += 3;
  if (data.followers > 200) scores["Community Builder"] += 3;
  if (data.followers > 50) scores["Open Source Hero"] += 2;
  if (data.accountAge > 8) scores["Consistency King"] += 3;
  if (data.accountAge > 4) scores["Consistency King"] += 2;
  if (data.openIssuesCount > 20) scores["Bug Hunter"] += 2;
  if (data.totalRepos > 20 && data.languageDiversity > 4) scores["Code Explorer"] += 2;
  if (data.totalStars > 50 && data.totalRepos > 10) scores["Full Stack Nomad"] += 2;

  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const topType = sorted[0][0] as DeveloperPersonalityType;

  return { type: topType, ...personalities[topType] };
}

export function getAllPersonalities(): DeveloperPersonality[] {
  return Object.entries(personalities).map(([type, props]) => ({
    type: type as DeveloperPersonalityType,
    ...props,
  }));
}
