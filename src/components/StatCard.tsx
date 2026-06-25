"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  prefix?: string;
  suffix?: string;
  delay?: number;
  gradient?: string;
}

export function StatCard({ label, value, icon, prefix = "", suffix = "", delay = 0, gradient }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-300"
    >
      {gradient && (
        <div
          className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500"
          style={{ background: `linear-gradient(135deg, ${gradient}, transparent)` }}
        />
      )}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold tracking-tight">
          <AnimatedCounter end={value} prefix={prefix} suffix={suffix} />
        </div>
      </div>
    </motion.div>
  );
}
