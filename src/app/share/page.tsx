"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWrappedData } from "@/hooks/useWrappedData";
import { ShareCard } from "@/components/ShareCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function SharePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState<string | null>(null);
  const { data, loading } = useWrappedData(submittedUsername || undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setSubmittedUsername(username.trim());
    }
  };

  if (!submittedUsername) {
    return (
      <div className="min-h-screen bg-black">
        <div className="fixed inset-0 bg-grid opacity-20" />
        <div className="max-w-lg mx-auto px-4 py-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Share GitHub Wrapped</h1>
            <p className="text-muted-foreground">Enter a username to generate a share card</p>
          </motion.div>
          <form onSubmit={handleSearch} className="max-w-sm mx-auto">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username..."
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 mb-4"
              aria-label="GitHub username"
            />
            <Button type="submit" variant="gradient" className="w-full">
              <Search className="w-4 h-4 mr-2" /> Generate Card
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return null;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 bg-grid opacity-20" />
      <div className="max-w-lg mx-auto px-4 py-8">
        <button
          onClick={() => setSubmittedUsername(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Search Another
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">{data.name}&apos;s Wrapped</h1>
          <p className="text-muted-foreground">Download or share this card</p>
        </motion.div>
        <div className="flex justify-center">
          <ShareCard
            data={{
              username: data.username,
              name: data.name,
              avatarUrl: data.avatarUrl,
              totalRepos: data.totalRepos,
              totalStars: data.totalStars,
              topLanguage: data.topLanguages[0]?.name || "Code",
              personality: data.personality.type,
              year: new Date().getFullYear(),
            }}
          />
        </div>
      </div>
    </div>
  );
}
