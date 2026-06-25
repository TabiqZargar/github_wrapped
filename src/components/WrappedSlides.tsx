"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WrappedData } from "@/types";
import { AnimatedCounter } from "./AnimatedCounter";

interface WrappedSlidesProps {
  data: WrappedData;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -600 : 600,
    opacity: 0,
  }),
};

const barColors = ["#6fdd78", "#a2c9ff", "#d8baff", "#fda4af", "#fbbf24", "#67e8f9"];

export function WrappedSlides({ data }: WrappedSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const slides = [
    { id: "welcome", component: <SlideWelcome data={data} /> },
    { id: "repos", component: <SlideRepos data={data} /> },
    { id: "language", component: <SlideTopLanguage data={data} /> },
    { id: "starred", component: <SlideStarred data={data} /> },
    { id: "diversity", component: <SlideDiversity data={data} /> },
    { id: "reach", component: <SlideReach data={data} /> },
    { id: "personality", component: <SlidePersonality data={data} /> },
    { id: "achievements", component: <SlideAchievements data={data} /> },
    { id: "summary", component: <SlideSummary data={data} /> },
    { id: "share", component: <SlideShare data={data} /> },
  ];

  const totalSlides = slides.length;
  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

  const goNext = useCallback(() => {
    if (canGoNext) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [canGoNext]);

  const goPrev = useCallback(() => {
    if (canGoPrev) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [canGoPrev]);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      if (currentSlide >= totalSlides - 1) {
        setAutoplay(false);
        return;
      }
      goNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [autoplay, currentSlide, goNext, totalSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col" role="main" aria-label="GitHub Wrapped story">
      <div className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="flex gap-1.5 max-w-container-max mx-auto">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                i <= currentSlide ? "bg-white" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 max-w-container-max mx-auto">
          <span className="text-mono-label text-on-surface-variant">
            {currentSlide + 1} / {totalSlides}
          </span>
          <button
            onClick={() => setAutoplay(!autoplay)}
            className="text-on-surface-variant hover:text-white transition-colors"
            aria-label={autoplay ? "Pause autoplay" : "Start autoplay"}
          >
            <span className="material-symbols-outlined text-xl">
              {autoplay ? "pause" : "play_arrow"}
            </span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-container-max">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full"
            >
              {slides[currentSlide].component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-50">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className="glass-card rounded-full p-3 disabled:opacity-30 transition-opacity"
          aria-label="Previous slide"
        >
          <span className="material-symbols-outlined text-white">chevron_left</span>
        </button>
        {canGoNext ? (
          <button
            onClick={goNext}
            className="bg-primary text-on-primary font-semibold px-8 py-3 rounded-full transition-transform hover:scale-105"
            aria-label="Next slide"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => (window.location.href = `/dashboard?username=${data.username}`)}
            className="glass-card font-semibold px-8 py-3 rounded-full transition-transform hover:scale-105"
            aria-label="View dashboard"
          >
            View Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

function SlideWelcome({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-indigo-900 via-slate-900 to-black rounded-3xl p-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div className="w-32 h-32 rounded-full border-4 border-primary p-1">
          <img
            src={data.avatarUrl}
            alt={data.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-mono-label text-mono-label text-primary-fixed uppercase tracking-widest mt-6"
      >
        GitHub Wrapped {new Date().getFullYear()}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="font-display-xl text-display-lg-mobile md:text-display-xl text-white text-center mt-2"
      >
        {data.name}
      </motion.h1>
      {data.bio && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="font-body-lg text-body-lg text-on-surface-variant max-w-xs text-center mt-4"
        >
          {data.bio}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="animate-bounce mt-8"
      >
        <span className="material-symbols-outlined text-on-surface-variant text-3xl">
          keyboard_double_arrow_down
        </span>
      </motion.div>
    </div>
  );
}

function SlideRepos({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-emerald-900 via-teal-950 to-black rounded-3xl p-8">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-mono-label text-mono-label text-secondary uppercase tracking-widest mb-6"
      >
        Your Contribution
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4"
      >
        <span className="material-symbols-outlined text-8xl text-primary">inventory_2</span>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-9xl font-bold text-white"
        >
          <AnimatedCounter end={data.totalRepos} />
        </motion.div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="font-body-md text-body-md text-on-surface-variant mt-4"
      >
        Public Repositories
      </motion.p>
    </div>
  );
}

function SlideTopLanguage({ data }: { data: WrappedData }) {
  const top = data.topLanguages[0];
  if (!top) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-blue-900 via-indigo-950 to-black rounded-3xl p-8">
        <p className="text-on-surface-variant">No language data available</p>
      </div>
    );
  }
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-blue-900 via-indigo-950 to-black rounded-3xl p-8 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-2 bg-gradient-to-t from-blue-400 to-cyan-300 rounded-full animate-float"
            style={{
              height: `${40 + i * 25}px`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-mono-label text-mono-label text-secondary uppercase tracking-widest mb-6 relative z-10"
      >
        Your Primary Tool
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 relative z-10 text-center"
      >
        {top.name}
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 w-full max-w-xs mt-8"
      >
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${top.percentage}%` }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"
          />
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="text-on-surface-variant mt-3 font-mono-label text-mono-label relative z-10"
      >
        {top.percentage.toFixed(0)}% of your code
      </motion.p>
    </div>
  );
}

function SlideStarred({ data }: { data: WrappedData }) {
  const repo = data.mostStarredRepo;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-purple-900 via-fuchsia-950 to-black rounded-3xl p-8">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-mono-label text-mono-label text-secondary uppercase tracking-widest mb-6"
      >
        Most Starred Repository
      </motion.p>
      {repo ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card premium-border rounded-2xl p-8 max-w-md w-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">grade</span>
            </div>
            <h3 className="text-xl font-bold text-white truncate">{repo.name}</h3>
          </div>
          {repo.description && (
            <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">{repo.description}</p>
          )}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">star</span>
              <span className="text-white font-bold text-xl">{repo.stargazers_count}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">fork_right</span>
              <span className="text-white font-bold text-xl">{repo.forks_count}</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-on-surface-variant"
        >
          No starred repositories found
        </motion.p>
      )}
    </div>
  );
}

function SlideDiversity({ data }: { data: WrappedData }) {
  const langs = data.topLanguages.slice(0, 5);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface-container-lowest rounded-3xl p-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-headline-md text-headline-md text-white mb-8"
      >
        Language Diversity
      </motion.h2>
      {langs.length > 0 ? (
        <div className="w-full max-w-md space-y-4">
          {langs.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-on-surface-variant">{lang.name}</span>
                <span className="text-sm text-on-surface-variant">{lang.percentage.toFixed(0)}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${lang.percentage}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColors[i % barColors.length] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-on-surface-variant">No language data available</p>
      )}
    </div>
  );
}

function SlideReach({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-rose-900 to-black rounded-3xl p-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-headline-md text-headline-md text-white mb-8"
      >
        Your Global Reach
      </motion.h2>
      <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
        {[
          { icon: "group", label: "Followers", value: data.followers },
          { icon: "person_add", label: "Following", value: data.following },
          { icon: "star", label: "Stars Earned", value: data.totalStars },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="glass-card rounded-2xl p-8 text-center"
          >
            <span className="material-symbols-outlined text-4xl text-primary mb-3 block">
              {item.icon}
            </span>
            <div className="text-4xl font-bold text-white mb-1">
              <AnimatedCounter end={item.value} />
            </div>
            <p className="text-xs text-on-surface-variant">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlidePersonality({ data }: { data: WrappedData }) {
  const { personality } = data;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-cyan-900 via-blue-900 to-black rounded-3xl p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card premium-border rounded-2xl p-8 text-center max-w-md w-full shadow-[0_0_50px_rgba(111,221,120,0.3)] hover:scale-105 transition-transform"
      >
        <div className="mb-6">
          <span className="material-symbols-outlined text-9xl animate-float text-primary">
            {personality.icon || "code"}
          </span>
        </div>
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">
          {personality.type}
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-4">
          {personality.description}
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <span className="px-3 py-1 bg-white/10 rounded-full font-mono-label text-mono-label text-on-surface-variant">
            {personality.badge}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function SlideAchievements({ data }: { data: WrappedData }) {
  const achievements = data.achievements.slice(0, 6);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-amber-900 via-orange-950 to-black rounded-3xl p-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-headline-md text-headline-md text-white mb-6"
      >
        Unlocked Achievements
      </motion.h2>
      {achievements.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`glass-card rounded-2xl p-6 flex flex-col items-center gap-3 ${
                !a.unlocked ? "opacity-40 grayscale" : ""
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  a.unlocked ? "bg-primary/20" : "bg-white/5"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-3xl ${
                    a.unlocked ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {a.icon || "emoji_events"}
                </span>
              </div>
              <p className="font-mono-label text-mono-label text-xs text-center text-on-surface-variant">
                {a.title}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-on-surface-variant">No achievements yet</p>
      )}
    </div>
  );
}

function SlideSummary({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black rounded-3xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card premium-border rounded-2xl p-12 max-w-xl w-full"
      >
        <h2 className="font-headline-md text-headline-md text-white mb-6 text-center">
          The {new Date().getFullYear()} Summary
        </h2>
        <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
          {data.name} has built{" "}
          <span className="text-primary font-bold">{data.totalRepos}</span> public
          repositories, earning{" "}
          <span className="text-secondary font-bold">{data.totalStars}</span> stars and{" "}
          <span className="text-tertiary font-bold">{data.totalForks}</span> forks.{" "}
          {data.topLanguages[0]?.name || "Code"} is the primary language. With{" "}
          <span className="text-primary font-bold">{data.followers}</span> followers and{" "}
          <span className="text-secondary font-bold">{data.accountAge}</span> years on GitHub,
          they&apos;ve earned the{" "}
          <span className="text-tertiary font-bold">{data.personality.type}</span> personality.
        </p>
      </motion.div>
    </div>
  );
}

function SlideShare({ data }: { data: WrappedData }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-b from-primary/40 via-background to-black rounded-3xl p-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display-xl text-display-lg-mobile md:text-display-xl text-white text-center mb-8"
      >
        Ready to share?
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => (window.location.href = "/share")}
          className="bg-primary text-on-primary font-semibold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105"
        >
          Share My Wrapped
        </button>
        <button
          onClick={() => (window.location.href = `/dashboard?username=${data.username}`)}
          className="glass-card font-semibold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105"
        >
          View Dashboard
        </button>
      </motion.div>
    </div>
  );
}
