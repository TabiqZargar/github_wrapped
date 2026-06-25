"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWrappedData } from "@/hooks/useWrappedData";
import { CompareView } from "@/components/CompareView";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function ComparePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const { data, loading } = useWrappedData(submitted || undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) setSubmitted(username.trim());
  };

  if (!submitted) {
    return (
      <div className="min-h-screen bg-black">
        <div className="fixed inset-0 bg-grid opacity-20" />
        <div className="max-w-lg mx-auto px-4 py-8">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-3xl font-bold mb-2">Compare</h1>
            <p className="text-muted-foreground mb-6">Enter a GitHub username to compare year-over-year</p>
            <form onSubmit={handleSubmit}>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="GitHub username..." className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 mb-4" aria-label="GitHub username" />
              <Button type="submit" variant="gradient" className="w-full"><Search className="w-4 h-4 mr-2" /> Compare</Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) return null;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 bg-grid opacity-20" />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => setSubmitted(null)} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Search Another
        </button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">{data.name}&apos;s Comparison</h1>
          <p className="text-muted-foreground mb-8">Year-over-year stats</p>
          <CompareView
            data={{
              commits: data.totalCommits || 0,
              repos: data.totalRepos,
              prs: 0,
              stars: data.totalStars,
              streak: 0,
              languages: data.languageDiversity,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
