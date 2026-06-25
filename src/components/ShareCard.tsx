"use client";

import { useRef } from "react";
import { toPng, toJpeg } from "html-to-image";
import { CardData } from "@/types";

interface ShareCardProps {
  data: CardData;
}

export function ShareCard({ data }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async (format: "png" | "jpeg") => {
    if (!cardRef.current) return;
    const fn = format === "png" ? toPng : toJpeg;
    const dataUrl = await fn(cardRef.current, { quality: 0.95 });
    const link = document.createElement("a");
    link.download = `github-wrapped-${data.username}-${data.year}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  const shareTwitter = () => {
    const text = `Check out ${data.name}'s GitHub Wrapped ${data.year}! ${data.totalRepos} repos, top language: ${data.topLanguage}, personality: ${data.personality}! #GitHubWrapped`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareLinkedIn = () => {
    const url = window.location.origin;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={cardRef}
        className="relative w-[400px] h-[560px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-primary/20 via-background to-tertiary/20"
      >
        <div className="absolute inset-4 glass-card rounded-[2rem] p-8 flex flex-col items-center justify-between">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img src={data.avatarUrl} alt={data.username} className="w-24 h-24 rounded-full border-4 border-primary object-cover" />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px] text-on-primary">verified</span>
              </span>
            </div>
            <div className="text-center">
              <p className="font-display-lg text-display-lg-mobile text-on-background">@{data.username}</p>
            </div>
            <div className="bg-primary/20 rounded-full px-4 py-1">
              <p className="text-sm text-primary font-medium">{data.personality}</p>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <div className="bg-white/5 p-4 rounded-2xl text-center">
              <p className="font-mono-label text-xs text-on-surface-variant uppercase tracking-wider">Total Repos</p>
              <p className="font-display-lg text-display-lg-mobile text-primary mt-1">{data.totalRepos.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl text-center">
              <p className="font-mono-label text-xs text-on-surface-variant uppercase tracking-wider">Top Language</p>
              <p className="font-headline-md text-headline-md text-secondary mt-1">{data.topLanguage}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl text-center">
              <p className="font-mono-label text-xs text-on-surface-variant uppercase tracking-wider">Stars</p>
              <p className="font-display-lg text-display-lg-mobile text-tertiary mt-1">{data.totalStars.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">workspace_premium</span>
            </div>
          </div>

          <p className="font-mono-label text-xs text-on-surface-variant/50">github-wrapped.app</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => downloadImage("png")} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all w-20">
          <span className="material-symbols-outlined text-2xl text-on-surface">download</span>
          <span className="font-mono-label text-[10px] text-on-surface-variant">PNG</span>
        </button>
        <button onClick={() => downloadImage("jpeg")} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all w-20">
          <span className="material-symbols-outlined text-2xl text-on-surface">image</span>
          <span className="font-mono-label text-[10px] text-on-surface-variant">JPEG</span>
        </button>
        <button onClick={shareTwitter} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all w-20">
          <span className="material-symbols-outlined text-2xl" style={{ color: "#1DA1F2" }}>potted_plant</span>
          <span className="font-mono-label text-[10px] text-on-surface-variant">Tweet</span>
        </button>
        <button onClick={shareLinkedIn} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all w-20">
          <span className="material-symbols-outlined text-2xl" style={{ color: "#0A66C2" }}>share</span>
          <span className="font-mono-label text-[10px] text-on-surface-variant">Post</span>
        </button>
      </div>
    </div>
  );
}
