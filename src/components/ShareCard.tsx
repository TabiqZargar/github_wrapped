"use client";

import { useRef } from "react";
import { toPng, toJpeg } from "html-to-image";
import { CardData } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download, Twitter, Linkedin } from "lucide-react";

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
    <div className="space-y-4">
      <div
        ref={cardRef}
        className="relative w-[400px] h-[560px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex flex-col justify-between"
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="w-12 h-12 ring-2 ring-purple-500/50">
              <AvatarImage src={data.avatarUrl} alt={data.username} />
              <AvatarFallback>{data.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">{data.name}</h3>
              <p className="text-sm text-muted-foreground">@{data.username}</p>
            </div>
          </div>
          <div className="text-5xl font-bold mb-2">
            {data.totalRepos.toLocaleString()}
          </div>
          <p className="text-muted-foreground text-lg">public repositories</p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 glass rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Top Language</p>
              <p className="font-bold text-lg">{data.topLanguage}</p>
            </div>
            <div className="flex-1 glass rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Stars Earned</p>
              <p className="font-bold text-lg">{data.totalStars}</p>
            </div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Developer Personality</p>
            <p className="font-bold text-xl text-gradient">{data.personality}</p>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            github-wrapped.app
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        <Button variant="outline" size="sm" onClick={() => downloadImage("png")}>
          <Download className="w-4 h-4 mr-2" /> PNG
        </Button>
        <Button variant="outline" size="sm" onClick={() => downloadImage("jpeg")}>
          <Download className="w-4 h-4 mr-2" /> JPEG
        </Button>
        <Button variant="outline" size="sm" onClick={shareTwitter}>
          <Twitter className="w-4 h-4 mr-2" /> Tweet
        </Button>
        <Button variant="outline" size="sm" onClick={shareLinkedIn}>
          <Linkedin className="w-4 h-4 mr-2" /> Post
        </Button>
      </div>
    </div>
  );
}
