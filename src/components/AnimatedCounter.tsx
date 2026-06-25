"use client";

import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { formatNumber } from "@/lib/utils";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  formatter,
  className = "",
}: AnimatedCounterProps) {
  const { count, isAnimating } = useAnimatedCounter({ end, duration });
  const display = formatter ? formatter(count) : formatNumber(count);

  return (
    <span
      className={`tabular-nums transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-100"} ${className}`}
      aria-live="polite"
      aria-label={`${prefix}${end}${suffix}`}
    >
      {prefix}{display}{suffix}
    </span>
  );
}
