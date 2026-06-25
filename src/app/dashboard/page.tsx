"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useWrappedData } from "@/hooks/useWrappedData";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { cn } from "@/lib/utils";
import { LanguageStat, Achievement, DeveloperPersonality } from "@/types";

const tabs = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "languages", label: "Languages", icon: "code" },
  { id: "personality", label: "Personality", icon: "psychology" },
  { id: "insights", label: "Insights", icon: "lock" },
];

const quickStats = [
  { label: "Repos", key: "totalRepos", icon: "folder", value: (d: any) => d.totalRepos },
  { label: "Stars", key: "totalStars", icon: "star", value: (d: any) => d.totalStars },
  { label: "Followers", key: "followers", icon: "group", value: (d: any) => d.followers },
  { label: "Commits", key: "totalCommits", icon: "commit", value: (d: any) => d.totalCommits },
  { label: "PRs", key: "prs", icon: "merge_type", value: () => 0 },
  { label: "Issues", key: "openIssuesCount", icon: "bug_report", value: (d: any) => d.openIssuesCount },
  { label: "Gists", key: "gists", icon: "description", value: () => 0 },
  { label: "Streak", key: "streak", icon: "whatshot", value: () => 0 },
];

function DonutChart({ languages }: { languages: LanguageStat[] }) {
  const cx = 60, cy = 60, r = 54, strokeWidth = 20;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const sorted = [...languages].sort((a, b) => b.percentage - a.percentage);
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
      {sorted.map((lang) => {
        const segment = (lang.percentage / 100) * circumference;
        const segOffset = -offset;
        offset += segment;
        return (
          <circle
            key={lang.name}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={lang.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segment} ${circumference - segment}`}
            strokeDashoffset={segOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            className="transition-all duration-1000"
          />
        );
      })}
    </svg>
  );
}

function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
      {achievements.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className={cn(
            "glass-card p-6 rounded-2xl text-center transition-all duration-300",
            a.unlocked ? "" : "opacity-40 grayscale"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl",
            a.unlocked ? "bg-white/10" : "bg-white/5"
          )}>
            {a.unlocked ? (
              <span className="text-2xl">{a.icon}</span>
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant text-2xl">lock</span>
            )}
          </div>
          <h4 className="font-semibold text-sm text-on-surface mb-1">{a.title}</h4>
          <span className={cn(
            "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full",
            a.unlocked ? "bg-primary/20 text-primary" : "bg-white/5 text-on-surface-variant"
          )}>
            {a.unlocked ? "Unlocked" : "Locked"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function StaticHeatmap() {
  const cols = 20, rows = 5;
  const levels = [0, 0, 0, 1, 0, 2, 0, 1, 1, 0, 3, 0, 2, 0, 0, 1, 0, 2, 0, 0];
  return (
    <div className="flex gap-[2px] justify-center">
      {Array.from({ length: cols }).map((_, ci) => (
        <div key={ci} className="flex flex-col gap-[2px]">
          {Array.from({ length: rows }).map((_, ri) => {
            const level = levels[(ci + ri) % levels.length];
            const colors = ["bg-white/5", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"];
            return (
              <div
                key={ri}
                className={cn("w-3 h-3 rounded-sm", colors[level])}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

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

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setSubmittedUsername(username.trim());
    }
  }, [username]);

  const resetSearch = useCallback(() => {
    setSubmittedUsername(null);
    setUsername("");
  }, []);

  if (!submittedUsername) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-on-primary text-3xl">search</span>
          </div>
          <h1 className="font-display-lg-mobile text-on-surface mb-3">GitHub Dashboard</h1>
          <p className="text-on-surface-variant font-body-lg mb-8">
            Enter a GitHub username to view their public profile stats
          </p>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="glass-card rounded-xl overflow-hidden">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                className="w-full h-12 px-4 bg-transparent text-on-surface placeholder:text-on-surface-variant focus:outline-none"
                aria-label="GitHub username"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined text-lg">search</span>
              Search
            </button>
          </form>
          <button
            onClick={() => router.push("/")}
            className="mt-6 text-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-base">home</span>
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-error mx-auto block mb-4">error</span>
          <h2 className="font-headline-md text-on-surface mb-2">Failed to Load Data</h2>
          <p className="text-on-surface-variant font-body-md mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={resetSearch}
              className="h-11 px-6 rounded-xl border border-white/10 text-on-surface font-medium hover:bg-white/5 transition-all"
            >
              Try Another User
            </button>
            <button
              onClick={() => window.location.reload()}
              className="h-11 px-6 rounded-xl bg-primary text-on-primary font-medium hover:brightness-110 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-surface-container-low/80 backdrop-blur-xl border-r border-white/10 z-30">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-xl">terminal</span>
            </div>
            <div>
              <h2 className="font-bold text-on-surface text-sm">Git Legend</h2>
              <p className="text-[10px] text-primary font-medium">Top 1% Contributor</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              )}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <button
            onClick={() => router.push(`/wrapped/${data.username}`)}
            className="w-full h-11 bg-primary text-on-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            View Wrapped
          </button>
          <button
            onClick={resetSearch}
            className="w-full flex items-center justify-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors py-2"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            Search Another
          </button>
          <button className="w-full flex items-center justify-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors py-2">
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 pb-20 lg:pb-0">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-8">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="relative w-full rounded-[2rem] h-64 md:h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                  <div className="flex items-end gap-4 md:gap-6">
                    <div className="relative flex-shrink-0">
                      <img
                        src={data.avatarUrl}
                        alt={data.username}
                        className="w-20 md:w-28 rounded-full border-4 border-primary shadow-[0_0_40px_rgba(111,221,120,0.3)]"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[10px] text-on-primary">check</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface">{data.name}</h1>
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          {data.personality.type}
                        </span>
                      </div>
                      <p className="text-on-surface-variant font-body-md mt-1">@{data.username}</p>
                      {data.bio && (
                        <p className="text-on-surface-variant text-sm mt-1 line-clamp-1">{data.bio}</p>
                      )}
                    </div>
                    <div className="hidden sm:flex items-center gap-2 pb-1">
                      <button className="h-9 px-4 rounded-xl border border-white/10 text-on-surface text-sm font-medium hover:bg-white/5 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">edit</span>
                        Edit Profile
                      </button>
                      <button className="h-9 w-9 rounded-xl border border-white/10 text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {quickStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass-card p-4 rounded-xl text-center"
                  >
                    <span className="material-symbols-outlined text-lg text-on-surface-variant mb-2 block">
                      {stat.icon}
                    </span>
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-white">
                      <AnimatedCounter end={stat.value(data)} />
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="holographic-border rounded-2xl">
                  <div className="holographic-content rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">psychology</span>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">The Personality</p>
                        <h3 className="font-headline-md text-on-surface">{data.personality.type}</h3>
                      </div>
                    </div>
                    <p className="text-on-surface-variant font-body-md mb-4">{data.personality.description}</p>
                    <div className="flex gap-2">
                      {data.achievements.filter((a) => a.unlocked).slice(0, 4).map((a) => (
                        <span key={a.id} className="text-xl" title={a.title}>{a.icon}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary">donut_large</span>
                    </div>
                    <h3 className="font-headline-md text-on-surface">Language Mix</h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <DonutChart languages={data.topLanguages} />
                    </div>
                    <div className="flex-1 space-y-2">
                      {data.topLanguages.map((lang) => (
                        <div key={lang.name} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: lang.color }}
                          />
                          <span className="text-sm text-on-surface flex-1">{lang.name}</span>
                          <span className="text-sm text-on-surface-variant font-mono-label">{lang.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline-md text-on-surface">Achievements</h3>
                  <button className="text-sm text-primary hover:underline flex items-center gap-1">
                    View Gallery
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                </div>
                <AchievementGrid achievements={data.achievements} />
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
                <h1 className="font-display-lg text-on-surface">Languages</h1>
                <p className="text-on-surface-variant font-body-md mt-1">Language breakdown across repositories</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-headline-md text-on-surface mb-6">Distribution</h3>
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48">
                      <DonutChart languages={data.topLanguages} />
                    </div>
                    <div className="mt-6 w-full space-y-3">
                      {data.topLanguages.map((lang) => (
                        <div key={lang.name} className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded flex-shrink-0"
                            style={{ backgroundColor: lang.color }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-on-surface">{lang.name}</span>
                              <span className="text-on-surface-variant">{lang.percentage}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${lang.percentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: lang.color }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-headline-md text-on-surface mb-6">Language Rankings</h3>
                  <div className="space-y-4">
                    {[...data.topLanguages].sort((a, b) => b.percentage - a.percentage).map((lang, i) => (
                      <div key={lang.name} className="flex items-center gap-4">
                        <span className="w-6 text-center text-sm font-mono-label text-on-surface-variant">{i + 1}</span>
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="flex-1 text-on-surface font-medium">{lang.name}</span>
                        <span className="text-sm text-on-surface-variant">{lang.count} repo{lang.count !== 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
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
                <h1 className="font-display-lg text-on-surface">Developer Personality</h1>
                <p className="text-on-surface-variant font-body-md mt-1">Coding identity based on public data</p>
              </div>
              <div className="max-w-lg mx-auto">
                <div className="holographic-border rounded-2xl">
                  <div className="holographic-content rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">{data.personality.icon}</div>
                    <h3 className="font-headline-md text-on-surface mb-2">{data.personality.type}</h3>
                    <span
                      className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4"
                      style={{
                        backgroundColor: `${data.personality.color}20`,
                        color: data.personality.color,
                        border: `1px solid ${data.personality.color}40`,
                      }}
                    >
                      {data.personality.badge}
                    </span>
                    <p className="text-on-surface-variant font-body-md leading-relaxed">{data.personality.description}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-headline-md text-on-surface mb-6">All Achievements</h3>
                <AchievementGrid achievements={data.achievements} />
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
                <h1 className="font-display-lg text-on-surface">Advanced Insights</h1>
                <p className="text-on-surface-variant font-body-md mt-1">Deeper analytics coming soon</p>
              </div>
              <div className="relative rounded-[2.5rem] border border-white/10 bg-surface-container-lowest p-12 text-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <StaticHeatmap />
                </div>
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-primary">lock</span>
                  </div>
                  <h2 className="font-headline-md text-on-surface mb-3">Contribution Heatmaps</h2>
                  <p className="text-on-surface-variant font-body-md max-w-md mx-auto mb-6">
                    Connect your GitHub account to unlock deeper analytics including contribution heatmaps, commit streak analysis, daily contribution data, and private repository statistics.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button className="h-11 px-6 rounded-xl bg-primary text-on-primary font-semibold hover:brightness-110 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">link</span>
                      Connect GitHub
                    </button>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-on-surface-variant text-xs font-mono-label">
                      Coming Late 2024
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <footer className="border-t border-white/10 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px] text-on-primary">terminal</span>
              </div>
              &copy; 2024 Git Legend. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-on-surface-variant">
              <a href="#" className="hover:text-on-surface transition-colors">Privacy</a>
              <a href="#" className="hover:text-on-surface transition-colors">Terms</a>
              <a href="#" className="hover:text-on-surface transition-colors">API Status</a>
              <a href="#" className="hover:text-on-surface transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </main>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-container/90 backdrop-blur-xl border-t border-white/10 z-30">
        <div className="flex items-center justify-around h-16 px-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex flex-col items-center gap-0.5",
              activeTab === "overview" ? "text-primary" : "text-on-surface-variant"
            )}
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span className="text-[10px]">Dashboard</span>
          </button>
          <button
            onClick={() => router.push(`/wrapped/${data.username}`)}
            className="flex flex-col items-center gap-0.5 text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            <span className="text-[10px]">Wrapped</span>
          </button>
          <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center -mt-4 shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-on-primary text-2xl">add</span>
          </button>
          <button
            onClick={() => router.push("/compare")}
            className="flex flex-col items-center gap-0.5 text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-lg">compare_arrows</span>
            <span className="text-[10px]">Compare</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-lg">person</span>
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
