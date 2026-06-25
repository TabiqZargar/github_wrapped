"use client";

import { motion } from "framer-motion";
import { DeveloperPersonality } from "@/types";

interface PersonalityCardProps {
  personality: DeveloperPersonality;
  delay?: number;
}

export function PersonalityCard({ personality, delay = 0 }: PersonalityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="relative"
    >
      <div
        className="absolute inset-0 rounded-2xl blur-3xl opacity-20"
        style={{ backgroundColor: personality.color }}
      />
      <div className="relative glass-strong rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">{personality.icon}</div>
        <h3 className="text-2xl font-bold mb-2">{personality.type}</h3>
        <div
          className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4"
          style={{
            backgroundColor: `${personality.color}20`,
            color: personality.color,
            border: `1px solid ${personality.color}40`,
          }}
        >
          {personality.badge}
        </div>
        <p className="text-muted-foreground leading-relaxed">{personality.description}</p>
      </div>
    </motion.div>
  );
}
