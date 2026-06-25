"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const EXAMPLE_USERNAMES = ["octocat", "torvalds", "gaearon"];

const features = [
  {
    icon: "monitoring",
    title: "Beautiful Stats",
    desc: "Visualize public GitHub profiles with stunning charts and animations.",
  },
  {
    icon: "psychology",
    title: "Developer Personality",
    desc: "Discover coding personas with our personality engine based on public data.",
  },
  {
    icon: "share",
    title: "Shareable Cards",
    desc: "Share wrapped profiles on social media with beautiful exportable cards.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

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
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 -right-48 w-[600px] h-[600px] bg-primary/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 -left-48 w-[500px] h-[500px] bg-secondary/5 blur-[200px] rounded-full pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-container-max mx-auto bg-background/70 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="font-display-lg font-black text-primary">GitHub Wrapped</span>
        </div>
        <button
          disabled
          className="bg-white/5 text-on-surface-variant/50 px-4 py-2 rounded-lg border border-white/10 cursor-not-allowed"
        >
          Connect GitHub (coming soon)
        </button>
      </nav>

      <main className="relative z-10 pt-24 pb-32 px-6">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div
              className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                className="font-mono-label text-xs text-primary uppercase tracking-widest border border-primary/30 px-3 py-1 rounded-full w-fit bg-primary/5 mb-8"
              >
                Your coding journey, reimagined
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="font-display-xl text-display-lg-mobile md:text-display-xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary mb-6"
              >
                your year in code.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10"
              >
                A cinematic review of your repositories, contributions, and engineering impact.
              </motion.p>

              <motion.div variants={itemVariants} className="w-full max-w-lg">
                <form
                  onSubmit={handleSubmit}
                  className="glass-card p-2 rounded-2xl flex flex-col sm:flex-row gap-2 premium-border shadow-[0_0_40px_rgba(111,221,120,0.1)]"
                >
                  <div className="flex items-center px-4 gap-3 bg-surface-container-lowest rounded-xl border border-white/5 flex-1">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">alternate_email</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setError(""); }}
                      placeholder="GitHub username"
                      className="w-full h-12 bg-transparent text-on-background placeholder:text-on-surface-variant/50 focus:outline-none text-body-md"
                      aria-label="GitHub username"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(111,221,120,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">auto_fix_high</span>
                    Generate
                  </button>
                </form>
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}

              <motion.div variants={itemVariants} className="flex flex-wrap gap-2 items-center mt-6">
                <span className="text-xs text-on-surface-variant uppercase tracking-widest">Try:</span>
                {EXAMPLE_USERNAMES.map((name) => (
                  <button
                    key={name}
                    onClick={() => { setUsername(name); setError(""); }}
                    className="rounded-full bg-white/5 border border-white/10 text-xs hover:bg-primary/20 hover:border-primary/50 transition-all px-3 py-1"
                  >
                    {name}
                  </button>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-4 mt-10">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-background bg-white/10 flex items-center justify-center text-[10px] font-bold text-on-surface-variant"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    +2k
                  </div>
                </div>
                <span className="text-body-sm text-on-surface-variant">Join 50,000+ developers</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="hidden lg:flex flex-shrink-0 relative"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <div className="relative w-[320px]">
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />

                <div className="glass-card w-[320px] aspect-[9/16] rounded-[2rem] overflow-hidden relative animate-float">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/20" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-3xl text-primary">code</span>
                    </div>
                    <p className="font-headline-md text-on-background mb-2">Your Year in Code</p>
                    <p className="font-body-md text-on-surface-variant">Discover your story told through every commit, pull request, and late-night merge.</p>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />
                </div>

                <motion.div
                  className="absolute -top-6 -left-16 glass-card rounded-2xl px-4 py-3 flex items-center gap-3 animate-float-delayed"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <span className="material-symbols-outlined text-primary text-xl">commit</span>
                  <div>
                    <p className="font-mono-label text-xs text-primary">2.4k</p>
                    <p className="text-[11px] text-on-surface-variant">Total Commits</p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-12 glass-card rounded-2xl px-4 py-3 flex items-center gap-3 animate-float"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <span className="material-symbols-outlined text-secondary text-xl">military_tech</span>
                  <div>
                    <p className="font-mono-label text-xs text-secondary">Top 1%</p>
                    <p className="text-[11px] text-on-surface-variant">Contributor</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-32 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display-lg text-display-lg mb-16">
              Data meets <span className="text-primary">Art</span>.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="glass-card rounded-[2rem] p-8 premium-border text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
                    <span className="material-symbols-outlined text-3xl text-primary">{feature.icon}</span>
                  </div>
                  <h3 className="font-headline-md mb-3">{feature.title}</h3>
                  <p className="font-body-md text-on-surface-variant">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
