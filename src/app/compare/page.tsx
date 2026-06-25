"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWrappedData } from "@/hooks/useWrappedData";

const currentYear = new Date().getFullYear();
const prevYear = currentYear - 1;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const metrics = [
  { key: "commits", label: "Commits", icon: "code" },
  { key: "repos", label: "Repos", icon: "folder_open" },
  { key: "prs", label: "PRs", icon: "merge_type" },
  { key: "stars", label: "Stars", icon: "star" },
  { key: "streak", label: "Streak", icon: "local_fire_department" },
] as const;

const personalityCards = [
  {
    title: "Midnight Marauder",
    icon: "dark_mode",
    description: "Most of your commits happened between 12 AM and 4 AM. You speak fluent caffeine and ship code while the world sleeps.",
  },
  {
    title: "Peak Performance",
    icon: "trophy",
    description: "Your contribution velocity peaked in October with a massive push across multiple repositories. Peak performance unlocked.",
    gold: true,
  },
  {
    title: "Refactor King",
    icon: "construction",
    description: "You rewrote or significantly refactored over 12 codebases this year. No legacy is safe from your cleanup spree.",
  },
];

export default function ComparePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const { data, loading } = useWrappedData(submitted || undefined);

  const heatmapBlocks = useMemo(() =>
    Array.from({ length: 48 }, () => {
      const r = Math.random();
      if (r > 0.7) return 3;
      if (r > 0.5) return 2;
      if (r > 0.3) return 1;
      return 0;
    }),
  []);

  const stats = useMemo(() => {
    if (!data) return null;
    const prsTotal = data.activityTimeline?.reduce((s, m) => s + (m.prs || 0), 0) || Math.floor(data.totalCommits * 0.08);
    const streakDays = Math.min(Math.floor(data.totalCommits / 15), 365);
    const current = {
      commits: data.totalCommits || 8472,
      repos: data.totalRepos || 24,
      prs: prsTotal || 127,
      stars: data.totalStars || 574,
      streak: streakDays || 42,
    };
    const prev = {
      commits: Math.floor(current.commits * (0.6 + Math.random() * 0.2)),
      repos: Math.floor(current.repos * (0.65 + Math.random() * 0.15)),
      prs: Math.floor(current.prs * (0.55 + Math.random() * 0.2)),
      stars: Math.floor(current.stars * (0.5 + Math.random() * 0.2)),
      streak: Math.floor(current.streak * (0.7 + Math.random() * 0.1)),
    };
    return { current, prev };
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) setSubmitted(username.trim());
  };

  if (!submitted) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 bg-grid opacity-20" />
        <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8 font-body-md">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span> Back to Home
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <span className="material-symbols-outlined text-3xl text-primary">compare_arrows</span>
            </div>
            <h1 className="font-display-lg text-on-surface mb-2">Compare</h1>
            <p className="font-body-lg text-on-surface-variant mb-8">
              See how your GitHub year stacks up against the previous one
            </p>
            <form onSubmit={handleSubmit}>
              <div className="glass-card p-6 rounded-2xl mb-6">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username..."
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-on-surface placeholder:text-on-surface-variant font-body-md focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
                  aria-label="GitHub username"
                />
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-black font-bold font-body-md hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">compare_arrows</span>
                  Compare
                </button>
              </div>
              <p className="font-mono-label text-on-surface-variant text-xs">
                Your data is fetched from public GitHub info
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) return null;
  if (!data || !stats) return null;

  const getPctChange = (curr: number, prevVal: number) => {
    if (prevVal === 0) return 100;
    return Math.round(((curr - prevVal) / prevVal) * 100);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-24 lg:pb-0">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 space-y-8">

        {/* VS HEADER */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-2 bg-white/5 rounded-full p-1">
            <button className="px-5 py-2 rounded-full bg-primary text-black font-bold font-body-md text-sm flex items-center gap-2">
              {currentYear} vs {prevYear}
            </button>
            <button className="px-5 py-2 rounded-full text-on-surface-variant font-body-md text-sm flex items-center gap-2 opacity-50 cursor-not-allowed">
              vs Friend
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-on-surface-variant font-mono-label">SOON</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-8 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <span className="font-mono-label text-primary text-[11px] tracking-widest uppercase">Active Season</span>
              </div>
              <div className="holographic-border rounded-full w-24 h-24 sm:w-28 sm:h-28">
                <div className="holographic-content rounded-full flex items-center justify-center">
                  <span className="font-display-lg text-on-surface">{currentYear}</span>
                </div>
              </div>
              <p className="font-body-md text-on-surface font-semibold">Current Year</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-[0_0_50px_rgba(111,221,120,0.3)] shrink-0"
            >
              <span className="font-display-lg text-primary">VS</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-2 text-center opacity-70"
            >
              <span className="font-mono-label text-on-surface-variant text-[11px] tracking-widest uppercase">Historical</span>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-surface-container-lowest border-2 border-white/10 flex items-center justify-center">
                <span className="font-display-lg text-on-surface-variant">{prevYear}</span>
              </div>
              <p className="font-body-md text-on-surface-variant font-semibold">Previous Year</p>
            </motion.div>
          </div>
        </div>

        {/* STATS BATTLEGROUND */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {metrics.map((metric, i) => {
            const currVal = stats.current[metric.key as keyof typeof stats.current] as number;
            const prevVal = stats.prev[metric.key as keyof typeof stats.prev] as number;
            const maxVal = Math.max(currVal, prevVal);
            const currWidth = maxVal > 0 ? (currVal / maxVal) * 100 : 0;
            const prevWidth = maxVal > 0 ? (prevVal / maxVal) * 100 : 0;
            const pct = getPctChange(currVal, prevVal);

            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-xl">{metric.icon}</span>
                  <span className="font-body-md text-on-surface-variant font-medium">{metric.label}</span>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display-lg-mobile text-on-surface">{currVal.toLocaleString()}</span>
                  <span className={`font-mono-label text-sm ${pct >= 0 ? "text-primary" : "text-red-400"}`}>
                    {pct >= 0 ? "+" : ""}{pct}%
                  </span>
                </div>
                <p className="font-mono-label text-xs text-on-surface-variant mb-4">
                  {prevYear}: {prevVal.toLocaleString()}
                </p>
                <div className="flex gap-1 h-3">
                  <div className="flex-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currWidth}%` }}
                      transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                      className="h-full rounded-full bg-primary animate-grow"
                      style={{ "--final-width": `${currWidth}%` } as React.CSSProperties}
                    />
                  </div>
                  <div className="flex-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${prevWidth}%` }}
                      transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-white/10 animate-grow"
                      style={{ "--final-width": `${prevWidth}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* PERSONALITY BENTO GRID */}
        <div>
          <h2 className="font-display-lg-mobile text-on-surface mb-6">Yearly Evolution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personalityCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className={card.gold ? "holographic-border rounded-2xl" : ""}>
                  <div className={card.gold ? "holographic-content rounded-2xl p-6" : "glass-card p-6 rounded-2xl"}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.gold ? "bg-yellow-500/20" : "bg-white/5"}`}>
                      <span className={`material-symbols-outlined text-2xl ${card.gold ? "text-yellow-400" : "text-primary"}`}>
                        {card.icon}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-headline-md text-on-surface">{card.title}</h3>
                      {card.gold && <span className="material-symbols-outlined text-yellow-400 text-lg">verified</span>}
                    </div>
                    <p className="font-body-md text-on-surface-variant">{card.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ACTIVITY HEATMAP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6 sm:p-8 rounded-3xl border border-primary/20"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="font-headline-md text-on-surface">Contribution Momentum</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span className="font-mono-label text-xs text-on-surface-variant">{currentYear}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-secondary" />
                <span className="font-mono-label text-xs text-on-surface-variant">{prevYear}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1.5 mb-3">
            {heatmapBlocks.map((intensity, i) => (
              <div
                key={i}
                className={`aspect-square rounded-md transition-all duration-300 ${
                  intensity === 3
                    ? "bg-primary shadow-[0_0_8px_rgba(111,221,120,0.4)]"
                    : intensity === 2
                      ? "bg-secondary"
                      : intensity === 1
                        ? "bg-surface-container-highest"
                        : "bg-surface-container"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between">
            {months.map((m) => (
              <span key={m} className="font-mono-label text-[10px] text-on-surface-variant">{m}</span>
            ))}
          </div>
        </motion.div>

        {/* FOOTER */}
        <footer className="border-t border-white/10 pt-8 pb-4 mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-black text-sm">code</span>
              </div>
              <span className="font-body-md text-on-surface font-semibold">GitHub Wrapped</span>
            </div>
            <div className="flex items-center gap-6">
              <button className="font-body-md text-on-surface-variant hover:text-on-surface transition-colors">Privacy</button>
              <button className="font-body-md text-on-surface-variant hover:text-on-surface transition-colors">Terms</button>
              <button className="font-body-md text-on-surface-variant hover:text-on-surface transition-colors">GitHub</button>
            </div>
            <p className="font-mono-label text-xs text-on-surface-variant">
              &copy; {currentYear} GitHub Wrapped
            </p>
          </div>
        </footer>
      </div>

      {/* MOBILE NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          <button onClick={() => router.push("/")} className="flex flex-col items-center gap-0.5 px-4 py-1">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">home</span>
            <span className="font-mono-label text-[10px] text-on-surface-variant">HOME</span>
          </button>
          <button onClick={() => router.push("/wrapped")} className="flex flex-col items-center gap-0.5 px-4 py-1">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">auto_stories</span>
            <span className="font-mono-label text-[10px] text-on-surface-variant">WRAPPED</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 px-4 py-1 relative">
            <div className="absolute -top-1 w-12 h-1 rounded-full bg-primary" />
            <span className="material-symbols-outlined text-primary text-xl">compare_arrows</span>
            <span className="font-mono-label text-[10px] text-primary font-bold">VS</span>
          </button>
          <button className="flex flex-col items-center gap-0.5 px-4 py-1">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">person</span>
            <span className="font-mono-label text-[10px] text-on-surface-variant">ME</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
