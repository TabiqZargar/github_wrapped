"use client";

import { motion } from "framer-motion";
import { LanguageStat } from "@/types";
import { getLanguageColor } from "@/lib/utils";

interface LanguageChartProps {
  languages: LanguageStat[];
}

export function LanguageChart({ languages }: LanguageChartProps) {
  const total = languages.reduce((sum, l) => sum + l.count, 0);
  const sorted = [...languages].sort((a, b) => b.count - a.count);
  const top5 = sorted.slice(0, 5);

  return (
    <div className="space-y-4">
      {top5.map((lang, index) => (
        <motion.div
          key={lang.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(lang.name) }}
              />
              <span className="text-sm font-medium">{lang.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {lang.count} repos
            </span>
          </div>
          <div className="relative h-2.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${lang.percentage}%` }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ backgroundColor: getLanguageColor(lang.name) }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{lang.percentage}%</span>
        </motion.div>
      ))}
    </div>
  );
}
