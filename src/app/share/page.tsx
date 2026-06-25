"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useWrappedData } from "@/hooks/useWrappedData";
import { ShareCard } from "@/components/ShareCard";

export default function SharePage() {
  return (
    <Suspense fallback={null}>
      <SharePageInner />
    </Suspense>
  );
}

function SharePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState<string | null>(null);

  useEffect(() => {
    const param = searchParams.get("username");
    if (param) {
      setUsername(param);
      setSubmittedUsername(param);
    }
  }, [searchParams]);

  const { data, loading } = useWrappedData(submittedUsername || undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setSubmittedUsername(username.trim());
    }
  };

  if (!submittedUsername) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="fixed top-0 -right-48 w-[600px] h-[600px] bg-primary/5 blur-[200px] rounded-full pointer-events-none" />

        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-container-max mx-auto bg-background/70 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="font-display-lg font-black text-primary">GitHub Wrapped</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="/dashboard" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Dashboard</a>
            <a href="/" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Wrapped</a>
            <a href="/compare" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Compare</a>
            <a href="/share" className="text-sm text-primary border-b-2 border-primary pb-1">Share</a>
          </div>
          <button disabled className="bg-white/5 text-on-surface-variant/50 px-4 py-2 rounded-lg border border-white/10 cursor-not-allowed text-sm">
            Connect GitHub (coming soon)
          </button>
        </nav>

        <main className="relative z-10 pt-24 pb-32 px-6">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-3">Flaunt Your Year in Code</h1>
              <p className="font-body-lg text-on-surface-variant">Generate a beautiful share card for any GitHub profile and show off your coding journey.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <form onSubmit={handleSearch} className="glass-card p-2 rounded-2xl flex flex-col sm:flex-row gap-2 premium-border">
                <div className="flex items-center px-4 gap-3 bg-surface-container-lowest rounded-xl border border-white/5 flex-1">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">alternate_email</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="GitHub username"
                    className="w-full h-12 bg-transparent text-on-background placeholder:text-on-surface-variant/50 focus:outline-none font-body-md"
                    aria-label="GitHub username"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-on-primary font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(111,221,120,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-lg">auto_fix_high</span>
                  Generate Card
                </button>
              </form>
            </motion.div>
            <div className="text-center mt-8">
              <a href="/" className="text-sm text-on-surface-variant hover:text-on-background transition-colors inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Home
              </a>
            </div>
          </div>
        </main>

        <footer className="border-t border-white/5 bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display-lg font-black text-primary text-sm">GitHub Wrapped</span>
              <span className="text-xs text-on-surface-variant/60">&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-on-surface-variant/60">
              <a href="#" className="hover:text-on-surface-variant transition-colors">Privacy</a>
              <a href="#" className="hover:text-on-surface-variant transition-colors">Terms</a>
              <a href="#" className="hover:text-on-surface-variant transition-colors">API Status</a>
              <a href="#" className="hover:text-on-surface-variant transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (loading) return null;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-container-max mx-auto bg-background/70 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-display-lg font-black text-primary">GitHub Wrapped</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="/dashboard" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Dashboard</a>
          <a href="/" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Wrapped</a>
          <a href="/compare" className="text-sm text-on-surface-variant hover:text-on-background transition-colors">Compare</a>
          <a href="/share" className="text-sm text-primary border-b-2 border-primary pb-1">Share</a>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
              <img src={data.avatarUrl} alt={data.username} className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-medium hidden sm:inline text-on-surface">{data.username}</span>
          </div>
        </div>
      </nav>

      <aside className="fixed left-0 top-0 h-full w-64 z-40 hidden lg:flex flex-col bg-surface-container-lowest border-r border-white/10 pt-20 pb-6 px-4">
        <div className="flex flex-col items-center py-6 border-b border-white/10 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary mb-3">
            <img src={data.avatarUrl} alt={data.username} className="w-full h-full object-cover" />
          </div>
          <p className="font-headline-md text-sm text-on-surface">{data.name}</p>
          <p className="text-xs text-on-surface-variant">@{data.username}</p>
        </div>
        <nav className="flex-1 space-y-1">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-background transition-all text-sm">
            <span className="material-symbols-outlined text-lg">dashboard</span>
            Dashboard
          </a>
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-background transition-all text-sm">
            <span className="material-symbols-outlined text-lg">auto_fix_high</span>
            Wrapped
          </a>
          <a href="/compare" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-background transition-all text-sm">
            <span className="material-symbols-outlined text-lg">compare_arrows</span>
            Compare
          </a>
          <a href="/share" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all text-sm">
            <span className="material-symbols-outlined text-lg">share</span>
            Share
          </a>
        </nav>
        <div className="pt-4 border-t border-white/10 space-y-1">
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-background transition-all text-sm">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Start New Wrapped
          </a>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-background transition-all text-sm">
            <span className="material-symbols-outlined text-lg">settings</span>
            Settings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-background transition-all text-sm">
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="relative z-10 pt-20 lg:pl-64">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-10">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-3">Flaunt Your Year in Code</h1>
            <p className="font-body-lg text-on-surface-variant">A shareable snapshot of {data.name}&apos;s coding journey.</p>
          </div>

          <div className="flex justify-center mb-10">
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

          <div className="text-center mt-8">
            <button
              onClick={() => setSubmittedUsername(null)}
              className="text-sm text-on-surface-variant hover:text-on-background transition-colors inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">search</span>
              Search Another
            </button>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/10 mt-12 max-w-2xl mx-auto">
            <h2 className="font-headline-md mb-6">Fine-Tune Your Flex</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary" />
                  <span className="font-body-md text-on-surface">Neon Matrix Theme</span>
                </div>
                <div className="w-10 h-6 rounded-full bg-white/10 relative cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 left-1" />
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-body-md text-on-surface">Show Mascot</span>
                <div className="w-10 h-6 rounded-full bg-white/10 relative cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 left-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/10 mt-6 max-w-2xl mx-auto text-center">
            <p className="font-body-md text-on-surface-variant">Customization preview coming soon</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-surface-container-lowest lg:pl-64">
        <div className="max-w-container-max mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display-lg font-black text-primary text-sm">GitHub Wrapped</span>
            <span className="text-xs text-on-surface-variant/60">&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-on-surface-variant/60">
            <a href="#" className="hover:text-on-surface-variant transition-colors">Privacy</a>
            <a href="#" className="hover:text-on-surface-variant transition-colors">Terms</a>
            <a href="#" className="hover:text-on-surface-variant transition-colors">API Status</a>
            <a href="#" className="hover:text-on-surface-variant transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
