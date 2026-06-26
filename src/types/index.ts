export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
  html_url: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  open_issues_count: number;
  default_branch: string;
  owner: { login: string; avatar_url: string };
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
  count: number;
  bytes?: number;
}

export interface WrappedData {
  username: string;
  avatarUrl: string;
  name: string;
  bio: string | null;
  location: string | null;
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  following: number;
  accountAge: number;
  accountCreated: string;
  topLanguages: LanguageStat[];
  languageDiversity: number;
  topRepositories: Repository[];
  projectOfYear: Repository & { commitCount: number };
  mostStarredRepo: Repository | null;
  oldestRepo: Repository | null;
  newestRepo: Repository | null;
  openIssuesCount: number;
  personality: DeveloperPersonality;
  achievements: Achievement[];
  activityTimeline: MonthlyActivity[];
}

export type DeveloperPersonalityType =
  | "Open Source Hero"
  | "Full Stack Nomad"
  | "Shipping Machine"
  | "Bug Hunter"
  | "Side Project Addict"
  | "Framework Hopper"
  | "Community Builder"
  | "Consistency King"
  | "Code Explorer";

export interface DeveloperPersonality {
  type: DeveloperPersonalityType;
  description: string;
  badge: string;
  color: string;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface MonthlyActivity {
  month: string;
  commits: number;
  prs: number;
  issues: number;
}

export interface CardData {
  username: string;
  name: string;
  avatarUrl: string;
  totalRepos: number;
  totalStars: number;
  topLanguage: string;
  personality: DeveloperPersonalityType;
  year: number;
}
