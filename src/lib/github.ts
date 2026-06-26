import { GitHubUser, Repository, LanguageStat, MonthlyActivity } from "@/types";

const GITHUB_API = "https://api.github.com";

class GitHubError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function githubFetch<T>(url: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitHub-Wrapped",
  };

  const response = await fetch(url, { headers });
  if (response.status === 403) {
    throw new GitHubError("Rate limited by GitHub API", 403);
  }
  if (response.status === 404) {
    throw new GitHubError("User not found", 404);
  }
  if (!response.ok) {
    throw new GitHubError(`GitHub API error: ${response.statusText}`, response.status);
  }
  return response.json();
}

export async function fetchPublicUser(username: string): Promise<GitHubUser> {
  return githubFetch<GitHubUser>(`${GITHUB_API}/users/${username}`);
}

export async function fetchPublicRepos(username: string): Promise<Repository[]> {
  const repos: Repository[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 10) {
    const data = await githubFetch<Repository[]>(
      `${GITHUB_API}/users/${username}/repos?per_page=100&page=${page}&sort=updated&type=public`
    );
    repos.push(...data);
    hasMore = data.length === 100;
    page++;
  }

  return repos;
}

export async function fetchRepoLanguages(username: string, repo: string, primaryLanguage: string | null): Promise<Record<string, number>> {
  if (!primaryLanguage) return {};
  try {
    return await githubFetch<Record<string, number>>(
      `${GITHUB_API}/repos/${username}/${repo}/languages`
    );
  } catch {
    return { [primaryLanguage]: 1 };
  }
}

export async function fetchAllLanguages(username: string, repos: Repository[]): Promise<LanguageStat[]> {
  const colors: Record<string, string> = {
    TypeScript: "#3178C6", JavaScript: "#F7DF1E", Python: "#3572A5", Rust: "#DEA584",
    Go: "#00ADD8", Java: "#B07219", "C++": "#F34B7D", C: "#555555", "C#": "#178600",
    Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
    HTML: "#E34F26", CSS: "#563D7C", Shell: "#89E051", Lua: "#000080", Scala: "#C22D40",
    Haskell: "#5D4F85",
  };

  const reposWithLang = repos.filter((r) => r.language);
  const langBytes = new Map<string, number>();
  const langRepoSet = new Map<string, Set<string>>();

  const batchSize = 5;
  let byteFetchFailed = false;

  for (let i = 0; i < reposWithLang.length; i += batchSize) {
    const batch = reposWithLang.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((repo) => fetchRepoLanguages(username, repo.name, repo.language))
    );
    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const repoName = batch[j].name;
      if (result.status === "fulfilled") {
        const langData = result.value;
        if (Object.keys(langData).length === 0) continue;
        for (const [lang, bytes] of Object.entries(langData)) {
          langBytes.set(lang, (langBytes.get(lang) || 0) + bytes);
          if (!langRepoSet.has(lang)) langRepoSet.set(lang, new Set());
          langRepoSet.get(lang)!.add(repoName);
        }
      } else {
        byteFetchFailed = true;
      }
    }
    if (byteFetchFailed) break;
  }

  if (langBytes.size === 0) {
    console.warn("[fetchAllLanguages] All language API calls failed, falling back to primary language counts");
    for (const repo of reposWithLang) {
      const lang = repo.language!;
      langBytes.set(lang, (langBytes.get(lang) || 0) + 1);
      if (!langRepoSet.has(lang)) langRepoSet.set(lang, new Set());
      langRepoSet.get(lang)!.add(repo.name);
    }
  }

  const totalBytes = Array.from(langBytes.values()).reduce((a, b) => a + b, 0);
  console.log(`[fetchAllLanguages] Total bytes across all languages: ${totalBytes}`);

  const sorted = Array.from(langBytes.entries())
    .map(([name, bytes]) => ({
      name,
      percentage: totalBytes > 0 ? parseFloat(((bytes / totalBytes) * 100).toFixed(1)) : 0,
      color: colors[name] || "#6B7280",
      count: langRepoSet.get(name)?.size || 1,
      bytes,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  console.log(`[fetchAllLanguages] Detected ${sorted.length} unique languages`);
  sorted.forEach((l) => console.log(`  ${l.name}: ${l.bytes} bytes (${l.percentage}%) across ${l.count} repos`));

  return sorted;
}

export function calculateAccountAge(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
}

export function calculateMonthlyActivityFallback(repos: Repository[]): MonthlyActivity[] {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const monthMap = new Map<number, number>();

  for (const repo of repos) {
    const created = new Date(repo.created_at);
    const month = created.getMonth();
    if (created.getFullYear() === now.getFullYear()) {
      monthMap.set(month, (monthMap.get(month) || 0) + 1);
    }
  }

  return Array.from({ length: 12 }, (_, i) => ({
    month: monthNames[i],
    commits: monthMap.get(i) || 0,
    prs: 0,
    issues: 0,
  }));
}
