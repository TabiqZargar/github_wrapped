import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178C6", JavaScript: "#F7DF1E", Python: "#3572A5", Rust: "#DEA584",
    Go: "#00ADD8", Java: "#B07219", "C++": "#F34B7D", C: "#555555", "C#": "#178600",
    Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
    HTML: "#E34F26", CSS: "#563D7C", Shell: "#89E051", Lua: "#000080", Scala: "#C22D40",
    Haskell: "#5D4F85",
  };
  return colors[language] || "#6B7280";
}

export function getPersonalityIcon(type: string): string {
  const icons: Record<string, string> = {
    "Open Source Hero": "🦸",
    "Full Stack Nomad": "🌐",
    "Shipping Machine": "🚢",
    "Bug Hunter": "🐛",
    "Side Project Addict": "💡",
    "Framework Hopper": "🔀",
    "Community Builder": "🤝",
    "Consistency King": "👑",
    "Code Explorer": "🧭",
  };
  return icons[type] || "💻";
}
