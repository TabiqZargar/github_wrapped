import { GitHubUser, Repository, WrappedData } from "@/types";

export function generateMockUser(username: string): GitHubUser {
  return {
    id: 12345,
    login: username,
    avatar_url: `https://avatars.githubusercontent.com/u/12345?v=4`,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    bio: "Full-stack developer passionate about open source",
    company: "@tech-company",
    blog: "https://example.com",
    location: "San Francisco, CA",
    email: null,
    followers: 234,
    following: 89,
    public_repos: 25,
    public_gists: 12,
    created_at: "2020-03-15T10:30:00Z",
    html_url: `https://github.com/${username}`,
  };
}

function generateMockRepos(username: string, avatarUrl: string): Repository[] {
  return [
    { id: 1, name: "awesome-project", full_name: `${username}/awesome-project`, description: "A revolutionary project built with modern web technologies", html_url: `https://github.com/${username}/awesome-project`, stargazers_count: 128, forks_count: 34, language: "TypeScript", topics: ["react", "typescript", "web"], owner: { login: username, avatar_url: avatarUrl }, created_at: "2025-01-15T00:00:00Z", updated_at: "2025-10-20T00:00:00Z", pushed_at: "2025-10-20T00:00:00Z", size: 2500, open_issues_count: 5, default_branch: "main" },
    { id: 2, name: "cli-tool", full_name: `${username}/cli-tool`, description: "Command-line utility for developer productivity", html_url: `https://github.com/${username}/cli-tool`, stargazers_count: 89, forks_count: 12, language: "Rust", topics: ["cli", "rust", "tooling"], owner: { login: username, avatar_url: avatarUrl }, created_at: "2025-03-10T00:00:00Z", updated_at: "2025-10-18T00:00:00Z", pushed_at: "2025-10-18T00:00:00Z", size: 800, open_issues_count: 2, default_branch: "main" },
    { id: 3, name: "data-viz-lib", full_name: `${username}/data-viz-lib`, description: "Beautiful data visualization components", html_url: `https://github.com/${username}/data-viz-lib`, stargazers_count: 256, forks_count: 45, language: "TypeScript", topics: ["visualization", "charts", "react"], owner: { login: username, avatar_url: avatarUrl }, created_at: "2025-05-20T00:00:00Z", updated_at: "2025-10-15T00:00:00Z", pushed_at: "2025-10-15T00:00:00Z", size: 1800, open_issues_count: 8, default_branch: "main" },
    { id: 4, name: "api-server", full_name: `${username}/api-server`, description: "High-performance API server framework", html_url: `https://github.com/${username}/api-server`, stargazers_count: 67, forks_count: 18, language: "Go", topics: ["api", "server", "go"], owner: { login: username, avatar_url: avatarUrl }, created_at: "2025-02-01T00:00:00Z", updated_at: "2025-10-12T00:00:00Z", pushed_at: "2025-10-12T00:00:00Z", size: 1500, open_issues_count: 3, default_branch: "main" },
    { id: 5, name: "ml-playground", full_name: `${username}/ml-playground`, description: "Machine learning experiments and tutorials", html_url: `https://github.com/${username}/ml-playground`, stargazers_count: 34, forks_count: 9, language: "Python", topics: ["machine-learning", "python", "tutorial"], owner: { login: username, avatar_url: avatarUrl }, created_at: "2025-07-05T00:00:00Z", updated_at: "2025-10-08T00:00:00Z", pushed_at: "2025-10-08T00:00:00Z", size: 3200, open_issues_count: 1, default_branch: "main" },
  ];
}

export function generateMockData(username: string, avatarUrl: string, name: string): WrappedData {
  const repos = generateMockRepos(username, avatarUrl);
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const totalCommits = Math.floor(1500 + Math.random() * 2500);

  const topLanguages = [
    { name: "TypeScript", percentage: 35.0, color: "#3178C6", count: 2 },
    { name: "JavaScript", percentage: 25.0, color: "#F7DF1E", count: 1 },
    { name: "Python", percentage: 18.0, color: "#3572A5", count: 1 },
    { name: "Rust", percentage: 12.0, color: "#DEA584", count: 1 },
    { name: "Go", percentage: 10.0, color: "#00ADD8", count: 1 },
  ];

  const sortedRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);

  return {
    username,
    avatarUrl,
    name,
    bio: "Full-stack developer passionate about open source",
    location: "San Francisco, CA",
    totalCommits,
    totalRepos: repos.length,
    totalStars,
    totalForks,
    followers: 234,
    following: 89,
    accountAge: 5,
    accountCreated: "2020-03-15T10:30:00Z",
    topLanguages,
    languageDiversity: topLanguages.length,
    topRepositories: sortedRepos,
    projectOfYear: { ...sortedRepos[0], commitCount: 342 },
    mostStarredRepo: sortedRepos[0],
    oldestRepo: repos.reduce((a, b) => new Date(a.created_at) < new Date(b.created_at) ? a : b),
    newestRepo: repos.reduce((a, b) => new Date(a.created_at) > new Date(b.created_at) ? a : b),
    openIssuesCount: repos.reduce((s, r) => s + r.open_issues_count, 0),
    personality: {
      type: "Side Project Addict",
      description: "You have a diverse portfolio of side projects. Each repository tells a story of curiosity and experimentation.",
      badge: "Idea Machine",
      color: "#10B981",
      icon: "💡",
    },
    achievements: [
      { id: "first-repo", title: "Project Starter", description: "Created your first repository", icon: "📦", unlocked: true },
      { id: "polyglot", title: "Code Polyglot", description: "Used 5+ different languages", icon: "🗣️", unlocked: true },
      { id: "star-50", title: "Rising Star", description: "Earned 50 stars across repositories", icon: "⭐", unlocked: true },
    ],
    activityTimeline: [
      { month: "Jan", commits: 120, prs: 8, issues: 5 },
      { month: "Feb", commits: 180, prs: 12, issues: 7 },
      { month: "Mar", commits: 250, prs: 15, issues: 9 },
      { month: "Apr", commits: 200, prs: 10, issues: 6 },
      { month: "May", commits: 300, prs: 18, issues: 11 },
      { month: "Jun", commits: 280, prs: 16, issues: 8 },
      { month: "Jul", commits: 150, prs: 9, issues: 4 },
      { month: "Aug", commits: 190, prs: 11, issues: 6 },
      { month: "Sep", commits: 350, prs: 22, issues: 14 },
      { month: "Oct", commits: 400, prs: 25, issues: 16 },
      { month: "Nov", commits: 320, prs: 19, issues: 12 },
      { month: "Dec", commits: 200, prs: 13, issues: 7 },
    ],
  };
}
