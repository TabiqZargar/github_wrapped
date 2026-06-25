"use client";

import { useState } from "react";
import { ContributionData } from "@/types";
import { cn } from "@/lib/utils";

interface HeatmapProps {
  data: ContributionData;
  className?: string;
}

export function Heatmap({ data, className }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const weeks = data.weeks.slice(-20);

  const getColor = (level: number) => {
    const colors = ["bg-[#161B22]", "bg-[#0E4429]", "bg-[#006D32]", "bg-[#26A641]", "bg-[#39D353]"];
    return colors[level] || colors[0];
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex gap-[3px]">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[3px]">
            {week.days.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className={cn(
                  "w-[10px] h-[10px] rounded-sm cursor-pointer transition-all duration-200 hover:scale-150 hover:ring-2 hover:ring-white/50",
                  getColor(day.level),
                  day.count === 0 && "opacity-40"
                )}
                onMouseEnter={(e) => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setTooltip({
                    date: day.date,
                    count: day.count,
                    x: rect.left,
                    y: rect.top - 40,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                role="gridcell"
                aria-label={`${day.count} contributions on ${day.date}`}
              />
            ))}
          </div>
        ))}
      </div>
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 text-xs font-medium bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <span className="text-white">{tooltip.count} contributions</span>
          <span className="text-muted-foreground ml-1">on {tooltip.date}</span>
        </div>
      )}
    </div>
  );
}
