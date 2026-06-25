import { NextRequest, NextResponse } from "next/server";
import {
  fetchPublicUser,
  fetchPublicRepos,
  fetchAllLanguages,
  calculateAccountAge,
  calculateMonthlyActivityFallback,
} from "@/lib/github";
import { determinePersonality } from "@/lib/personality";
import { calculateAchievements } from "@/lib/achievements";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const user = await fetchPublicUser(username);
    const repos = await fetchPublicRepos(username);
    const languages = await fetchAllLanguages(username, repos);

    const sortedRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count);
    const topRepos = sortedRepos.slice(0, 5);
    const mostStarredRepo = sortedRepos[0] || null;
    const projectOfYear = sortedRepos[0] || repos[0];
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
    const totalRepos = repos.length;
    const openIssuesCount = repos.reduce((sum, r) => sum + r.open_issues_count, 0);
    const accountAge = calculateAccountAge(user.created_at);
    const activityTimeline = calculateMonthlyActivityFallback(repos);

    const oldestRepo = repos.length > 0
      ? repos.reduce((a, b) => new Date(a.created_at) < new Date(b.created_at) ? a : b)
      : null;
    const newestRepo = repos.length > 0
      ? repos.reduce((a, b) => new Date(a.created_at) > new Date(b.created_at) ? a : b)
      : null;

    const personality = determinePersonality({
      totalRepos,
      totalStars,
      totalForks,
      followers: user.followers,
      languageDiversity: languages.length,
      accountAge,
      openIssuesCount,
    });

    const achievements = calculateAchievements({
      totalRepos,
      totalStars,
      totalForks,
      followers: user.followers,
      languageDiversity: languages.length,
      accountAge,
      totalCommits: 0,
    });

    return NextResponse.json({
      username: user.login,
      avatarUrl: user.avatar_url,
      name: user.name || user.login,
      bio: user.bio,
      location: user.location,
      totalCommits: 0,
      totalRepos,
      totalStars,
      totalForks,
      followers: user.followers,
      following: user.following,
      accountAge,
      accountCreated: user.created_at,
      topLanguages: languages,
      languageDiversity: languages.length,
      topRepositories: topRepos,
      projectOfYear: { ...projectOfYear, commitCount: 0 },
      mostStarredRepo,
      oldestRepo,
      newestRepo,
      openIssuesCount,
      personality,
      achievements,
      activityTimeline,
    });
  } catch (error: any) {
    if (error?.status === 404) {
      return NextResponse.json({ error: `User "${username}" not found` }, { status: 404 });
    }
    if (error?.status === 403) {
      return NextResponse.json(
        { error: "GitHub API rate limit exceeded. Wait about an hour and try again." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}
