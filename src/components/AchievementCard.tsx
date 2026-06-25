"use client";

import { motion } from "framer-motion";
import { Achievement } from "@/types";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
  achievement: Achievement;
  delay?: number;
}

export function AchievementCard({ achievement, delay = 0 }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-5 transition-all duration-300",
        achievement.unlocked
          ? "border-white/20 bg-white/5 hover:border-white/30"
          : "border-white/5 bg-white/[0.02] opacity-40"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "text-3xl",
          achievement.unlocked ? "" : "grayscale"
        )}>
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
        </div>
        {!achievement.unlocked && (
          <div className="text-xs text-muted-foreground px-2 py-1 rounded-full border border-white/10">
            Locked
          </div>
        )}
      </div>
    </motion.div>
  );
}
