"use client";

import { motion } from "framer-motion";
import { MonthlyActivity } from "@/types";

interface TimelineProps {
  data: MonthlyActivity[];
}

export function Timeline({ data }: TimelineProps) {
  const maxCommits = Math.max(...data.map((m) => m.commits || 0));

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-indigo-500/50 to-transparent" />
      <div className="space-y-0">
        {data.map((month, index) => {
          const height = maxCommits > 0 ? (month.commits / maxCommits) * 100 : 0;
          return (
            <motion.div
              key={month.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative flex items-start gap-6 pb-6 pl-10"
            >
              <div className="absolute left-[11px] w-3 h-3 rounded-full bg-purple-500 border-2 border-background z-10" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{month.month}</span>
                  <span className="text-sm text-muted-foreground">{month.commits} commits</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${height}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
