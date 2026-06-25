"use client";

import { useEffect, useState, useRef } from "react";

interface UseAnimatedCounterOptions {
  end: number;
  duration?: number;
  start?: number;
  enabled?: boolean;
}

export function useAnimatedCounter({ end, duration = 2000, start = 0, enabled = true }: UseAnimatedCounterOptions) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTime = useRef<number>(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    setIsAnimating(true);
    startTime.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);

      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsAnimating(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, start, enabled]);

  return { count, isAnimating };
}
