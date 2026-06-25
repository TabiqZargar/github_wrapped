"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useWrappedData } from "@/hooks/useWrappedData";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { StatCard } from "@/components/StatCard";
import { MonthlyChart } from "@/components/MonthlyChart";
import { LanguageChart } from "@/components/LanguageChart";
import { LanguagePieChart } from "@/components/PieChart";
import { PersonalityCard } from "@/components/PersonalityCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  GitBranch, Star, Users,
  Code2, Sparkles, Activity, BookOpen, Search,
  Play, AlertCircle, Github, Lock, Home, ExternalLink
} from "lucide-react";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState<string | null>(null);

  useEffect(() => {
    const param = searchParams.get("username");
    if (param) {
      setUsername(param);
      setSubmittedUsername(param);
    }
  }, [searchParams]);
  const { data, loading, error } = useWrappedData(submittedUsername || undefined);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setSubmittedUsername(username.trim());
    }
  };

  if (!submittedUsername) {
    return (
      <div className="min-h-screen bg-black">
        <div className="fixed inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[150px] rounded-full" />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">GitHub Dashboard</h1>
            <p className="text-muted-foreground mb-8">
              Enter a GitHub username to view their public profile stats
            </p>
            <form onSubmit={handleSearch} className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                aria-label="GitHub username"
              />
              <Button type="submit" variant="gradient" className="w-full" size="lg">
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>
            </form>
            <button
              onClick={() => router.push("/")}
              className="mt-6 text-sm text-muted-foreground hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              <Home className="w-4 h-4" /> Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load Data</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setSubmittedUsername(null)}>
              Try Another User
            </Button>
            <Button variant="gradient" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
    { id: "languages", label: "Languages", icon: <Code2 className="w-4 h-4" /> },
    { id: "personality", label: "Personality", icon: <Sparkles className="w-4 h-4" /> },
    { id: "insights", label: "Insights", icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black">
        <div className="fixed inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 blur-[150px] rounded-full" />

        <nav className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg hidden sm:inline">GitHub Wrapped</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={data.avatarUrl} alt={data.username} />
                    <AvatarFallback>{data.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{data.username}</span>
                </div>
                <Button variant="gradient" size="sm" onClick={() => router.push(`/wrapped/${data.username}`)} className="hidden sm:flex">
                  <Play className="w-4 h-4 mr-1" /> View Wrapped
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSubmittedUsername(null)} aria-label="Search another user">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-1 pb-3 overflow-x-auto">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="whitespace-nowrap"
                >
                  {tab.icon}
                  <span className="ml-1.5">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{data.name}</h1>
                  <p className="text-muted-foreground mt-1">@{data.username} &middot; {data.accountAge} years on GitHub</p>
                </div>
                <Button variant="gradient" onClick={() => router.push(`/wrapped/${data.username}`)} className="hidden sm:flex">
                  <Sparkles className="w-4 h-4 mr-2" /> View Full Wrapped
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Public Repos" value={data.totalRepos} icon={<BookOpen className="w-5 h-5" />} delay={0} gradient="#8B5CF6" />
                <StatCard label="Stars Earned" value={data.totalStars} icon={<Star className="w-5 h-5" />} delay={0.05} gradient="#EC4899" />
                <StatCard label="Forks" value={data.totalForks} icon={<GitBranch className="w-5 h-5" />} delay={0.1} gradient="#06B6D4" />
                <StatCard label="Followers" value={data.followers} icon={<Users className="w-5 h-5" />} delay={0.15} gradient="#3B82F6" />
                <StatCard label="Following" value={data.following} icon={<Users className="w-5 h-5" />} delay={0.2} gradient="#F59E0B" />
                <StatCard label="Languages" value={data.languageDiversity} icon={<Code2 className="w-5 h-5" />} delay={0.25} gradient="#10B981" />
                <StatCard label="Open Issues" value={data.openIssuesCount} icon={<Activity className="w-5 h-5" />} delay={0.3} gradient="#F97316" />
                <StatCard label="Account Age" value={data.accountAge} suffix=" years" icon={<Users className="w-5 h-5" />} delay={0.35} gradient="#8B5CF6" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Languages</h3>
                  <LanguageChart languages={data.topLanguages} />
                </div>
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
                  <LanguagePieChart data={data.topLanguages} />
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Top Repositories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.topRepositories.slice(0, 6).map((repo, i) => (
                    <motion.a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="block glass rounded-xl p-4 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Github className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-sm truncate group-hover:text-purple-400 transition-colors">{repo.name}</span>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {repo.language && <Badge variant="secondary" className="text-xs">{repo.language}</Badge>}
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" />{repo.stargazers_count}</span>
                        <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{repo.forks_count}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "languages" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold">Languages</h1>
                <p className="text-muted-foreground mt-1">Language breakdown across repositories</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Language Rankings</h3>
                  <LanguageChart languages={data.topLanguages} />
                </div>
                <div className="glass rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-6">Distribution</h3>
                  <LanguagePieChart data={data.topLanguages} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "personality" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold">Developer Personality</h1>
                <p className="text-muted-foreground mt-1">Coding identity based on public data</p>
              </div>
              <div className="max-w-md mx-auto">
                <PersonalityCard personality={data.personality} />
              </div>
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.achievements.filter(a => a.unlocked).slice(0, 9).map((achievement, i) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 glass rounded-xl p-4"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl font-bold">Advanced Insights</h1>
                <p className="text-muted-foreground mt-1">Deeper analytics coming soon</p>
              </div>
              <div className="glass rounded-xl p-12 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Advanced GitHub Insights</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Connect your GitHub account to unlock deeper analytics including contribution heatmaps, commit streak analysis, daily contribution data, and private repository statistics.
                </p>
                <Button variant="outline" size="lg" disabled className="opacity-50 cursor-not-allowed">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect GitHub (coming soon)
                </Button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
