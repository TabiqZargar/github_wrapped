"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRightLeft, GitCommit, Flame, Star, Code2, GitPullRequest } from "lucide-react";

interface CompareItem {
  label: string;
  value1: number;
  value2: number;
  icon: React.ReactNode;
}

interface CompareViewProps {
  data: {
    commits: number;
    repos: number;
    prs: number;
    stars: number;
    streak: number;
    languages: number;
  };
  year?: number;
}

export function CompareView({ data, year = 2025 }: CompareViewProps) {
  const [mode, setMode] = useState<"year" | "friend">("year");

  const year2 = year - 1;
  const mockYear2 = {
    commits: Math.floor(data.commits * 0.6),
    repos: Math.floor(data.repos * 0.7),
    prs: Math.floor(data.prs * 0.5),
    stars: Math.floor(data.stars * 0.4),
    streak: Math.floor(data.streak * 0.8),
    languages: Math.floor(data.languages * 0.8),
  };

  const items: CompareItem[] = [
    { label: "Commits", value1: data.commits, value2: mode === "year" ? mockYear2.commits : 0, icon: <GitCommit className="w-4 h-4" /> },
    { label: "Repos", value1: data.repos, value2: mode === "year" ? mockYear2.repos : 0, icon: <Code2 className="w-4 h-4" /> },
    { label: "PRs", value1: data.prs, value2: mode === "year" ? mockYear2.prs : 0, icon: <GitPullRequest className="w-4 h-4" /> },
    { label: "Stars", value1: data.stars, value2: mode === "year" ? mockYear2.stars : 0, icon: <Star className="w-4 h-4" /> },
    { label: "Streak", value1: data.streak, value2: mode === "year" ? mockYear2.streak : 0, icon: <Flame className="w-4 h-4" /> },
  ];

  const getPercentage = (val1: number, val2: number) => {
    if (val2 === 0) return 100;
    return Math.round(((val1 - val2) / val2) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2">
        <Button
          variant={mode === "year" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("year")}
        >
          {year} vs {year2}
        </Button>
        <Button
          variant={mode === "friend" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("friend")}
          disabled
        >
          vs Friend
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => {
          const pct = getPercentage(item.value1, item.value2);
          const isUp = pct > 0;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {item.icon}
                    {item.label}
                  </div>
                  <div className={`text-sm font-bold ${isUp ? "text-green-400" : "text-red-400"}`}>
                    {isUp ? "+" : ""}{pct}%
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{year}</span>
                      <span>{item.value1.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((item.value1 / Math.max(item.value1, item.value2)) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      />
                    </div>
                  </div>
                  <ArrowRightLeft className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{mode === "year" ? year2 : "Friend"}</span>
                      <span>{item.value2.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((item.value2 / Math.max(item.value1, item.value2)) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                        className="h-full rounded-full bg-gradient-to-r from-slate-500 to-slate-600"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
