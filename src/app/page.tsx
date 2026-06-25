"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Sparkles, Code2, BarChart3, Trophy, Search, ArrowRight } from "lucide-react";
import { ENABLE_GITHUB_LOGIN } from "@/lib/config";

const EXAMPLE_USERNAMES = ["octocat", "torvalds", "gaearon"];

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Please enter a GitHub username");
      return;
    }
    setError("");
    router.push(`/wrapped/${trimmed}`);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[200px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[200px] rounded-full" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">GitHub Wrapped</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="opacity-50 cursor-not-allowed"
          >
            <Github className="w-4 h-4 mr-2" />
            Connect GitHub (coming soon)
          </Button>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Your coding journey, reimagined
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            Discover Your Year in{" "}
            <span className="text-gradient">Code</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Enter any GitHub username to see their year in beautiful visualizations. No login required.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-lg mx-auto mb-6"
          >
            <div className="relative flex items-center">
              <div className="absolute left-4 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Enter GitHub username..."
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-lg"
                aria-label="GitHub username"
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-2 text-left"
              >
                {error}
              </motion.p>
            )}
            <Button
              type="submit"
              size="xl"
              variant="gradient"
              className="w-full mt-4 text-lg group"
            >
              Generate Wrapped
              <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <span>Try:</span>
            {EXAMPLE_USERNAMES.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setUsername(name);
                  setError("");
                }}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all text-foreground font-mono text-xs"
              >
                {name}
              </button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
        >
          {[
            { icon: <BarChart3 className="w-6 h-6" />, title: "Beautiful Stats", desc: "Visualize public GitHub profiles with stunning charts and animations." },
            { icon: <Trophy className="w-6 h-6" />, title: "Developer Personality", desc: "Discover coding personas with our personality engine based on public data." },
            { icon: <Sparkles className="w-6 h-6" />, title: "Shareable Cards", desc: "Share wrapped profiles on social media with beautiful exportable cards." },
          ].map((feature, i) => (
            <div key={i} className="glass rounded-xl p-6 text-center hover:bg-white/10 transition-all">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
