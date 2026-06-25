import { Achievement } from "@/types";

export function calculateAchievements(data: {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  languageDiversity: number;
  accountAge: number;
  totalCommits: number;
}): Achievement[] {
  const achievements: Achievement[] = [];

  achievements.push({
    id: "first-repo",
    title: "Project Starter",
    description: "Created your first repository",
    icon: "📦",
    unlocked: data.totalRepos > 0,
  });

  achievements.push({
    id: "repos-5",
    title: "Repo Collector",
    description: "Created 5+ repositories",
    icon: "🗂️",
    unlocked: data.totalRepos >= 5,
  });

  achievements.push({
    id: "repos-15",
    title: "Serial Creator",
    description: "Created 15+ repositories",
    icon: "📚",
    unlocked: data.totalRepos >= 15,
  });

  achievements.push({
    id: "repos-30",
    title: "Repo Empire",
    description: "Created 30+ repositories",
    icon: "🏗️",
    unlocked: data.totalRepos >= 30,
  });

  achievements.push({
    id: "star-50",
    title: "Rising Star",
    description: "Earned 50 stars across repositories",
    icon: "⭐",
    unlocked: data.totalStars >= 50,
  });

  achievements.push({
    id: "star-500",
    title: "Star Collector",
    description: "Earned 500+ stars across repositories",
    icon: "🌟",
    unlocked: data.totalStars >= 500,
  });

  achievements.push({
    id: "fork-10",
    title: "Community Choice",
    description: "Your repos have been forked 10+ times",
    icon: "🔀",
    unlocked: data.totalForks >= 10,
  });

  achievements.push({
    id: "fork-50",
    title: "Trending Creator",
    description: "Your repos have been forked 50+ times",
    icon: "📈",
    unlocked: data.totalForks >= 50,
  });

  achievements.push({
    id: "followers-30",
    title: "Growing Influence",
    description: "Gained 30+ followers",
    icon: "👥",
    unlocked: data.followers >= 30,
  });

  achievements.push({
    id: "followers-100",
    title: "Notable Developer",
    description: "Gained 100+ followers",
    icon: "🎯",
    unlocked: data.followers >= 100,
  });

  achievements.push({
    id: "polyglot",
    title: "Code Polyglot",
    description: "Used 5+ different languages",
    icon: "🗣️",
    unlocked: data.languageDiversity >= 5,
  });

  achievements.push({
    id: "polyglot-3",
    title: "Multilingual Coder",
    description: "Used 3+ different languages",
    icon: "🌍",
    unlocked: data.languageDiversity >= 3,
  });

  achievements.push({
    id: "veteran-3",
    title: "Seasoned Developer",
    description: "GitHub account over 3 years old",
    icon: "🎓",
    unlocked: data.accountAge >= 3,
  });

  achievements.push({
    id: "veteran-8",
    title: "GitHub Veteran",
    description: "GitHub account over 8 years old",
    icon: "👴",
    unlocked: data.accountAge >= 8,
  });

  achievements.push({
    id: "commits-100",
    title: "Century of Code",
    description: "100+ commits across repositories",
    icon: "📊",
    unlocked: data.totalCommits >= 100,
  });

  return achievements;
}
