"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WrappedData } from "@/types";
import { AnimatedCounter } from "./AnimatedCounter";
import { PersonalityCard } from "./PersonalityCard";
import { LanguageChart } from "./LanguageChart";
import { AchievementCard } from "./AchievementCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Star, Code2, Globe, FolderGit2, Crown, Users, BookOpen, Trophy, Github } from "lucide-react";

interface WrappedSlidesProps {
  data: WrappedData;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -600 : 600,
    opacity: 0,
    scale: 0.95,
  }),
};

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
    { id: "personality", component: (
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gradient">Your Developer Personality</h2>
        <PersonalityCard personality={data.personality} />
      </div>
    )},
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
        <div className="flex gap-1.5 max-w-2xl mx-auto">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                i <= currentSlide ? "bg-white" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">
            {currentSlide + 1} / {totalSlides}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoplay(!autoplay)}
            className="text-muted-foreground hover:text-white"
            aria-label={autoplay ? "Pause autoplay" : "Start autoplay"}
          >
            {autoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-3xl">
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
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Previous slide"
          className="bg-white/5 border-white/10 hover:bg-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        {canGoNext ? (
          <Button variant="gradient" onClick={goNext} aria-label="Next slide" className="min-w-[120px]">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button variant="gradient" onClick={() => window.location.href = `/dashboard?username=${data.username}`} aria-label="View dashboard" className="min-w-[160px]">
            View Dashboard <Sparkles className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

function SlideWelcome({ data }: { data: WrappedData }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-8 inline-block"
      >
        <Avatar className="w-28 h-28 ring-4 ring-purple-500/50 ring-offset-4 ring-offset-black mx-auto">
          <AvatarImage src={data.avatarUrl} alt={data.name} />
          <AvatarFallback className="text-3xl">{data.name[0]}</AvatarFallback>
        </Avatar>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-bold mb-3"
      >
        {data.name}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-muted-foreground mb-2"
      >
        @{data.username}
      </motion.p>
      {data.bio && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-base text-muted-foreground max-w-md mx-auto"
        >
          {data.bio}
        </motion.p>
      )}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-lg text-gradient font-semibold mt-4"
      >
        GitHub Wrapped {new Date().getFullYear()}
      </motion.p>
    </div>
  );
}

function SlideStat({ icon, value, label, subtitle, gradient, suffix = "" }: {
  icon: React.ReactNode; value: number; label: string; subtitle: string; gradient: string; suffix?: string;
}) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} mb-8 shadow-lg`}
      >
        {icon}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm uppercase tracking-widest text-muted-foreground mb-3"
      >
        {label}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-7xl font-bold mb-3"
      >
        <AnimatedCounter end={value} suffix={suffix} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-lg text-muted-foreground"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

function SlideRepos({ data }: { data: WrappedData }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-8 shadow-lg"
      >
        <BookOpen className="w-12 h-12" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm uppercase tracking-widest text-muted-foreground mb-3"
      >
        Public Repositories
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-7xl font-bold mb-3"
      >
        <AnimatedCounter end={data.totalRepos} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-lg text-muted-foreground"
      >
        projects built and shared with the world
      </motion.p>
    </div>
  );
}

function SlideTopLanguage({ data }: { data: WrappedData }) {
  const top = data.topLanguages[0];
  if (!top) return null;
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-8 shadow-lg"
      >
        <Code2 className="w-12 h-12" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm uppercase tracking-widest text-muted-foreground mb-3"
      >
        Most Used Language
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-6xl font-bold mb-3 text-gradient"
      >
        {top.name}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xl text-muted-foreground"
      >
        used in <span className="text-white font-bold">{top.count}</span> repository{top.count !== 1 ? "ies" : "y"}
      </motion.p>
    </div>
  );
}

function SlideStarred({ data }: { data: WrappedData }) {
  const repo = data.mostStarredRepo;
  return (
    <div className="text-center max-w-lg mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 mb-8 shadow-lg"
      >
        <Crown className="w-12 h-12" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm uppercase tracking-widest text-muted-foreground mb-3"
      >
        Most Starred Repository
      </motion.p>
      {repo ? (
        <>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold mb-2"
          >
            {repo.name}
          </motion.h2>
          {repo.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mb-4 text-sm"
            >
              {repo.description}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-6"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-gradient-gold">{repo.stargazers_count}</p>
              <p className="text-xs text-muted-foreground">Stars</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-3xl font-bold">{repo.forks_count}</p>
              <p className="text-xs text-muted-foreground">Forks</p>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground"
        >
          No starred repositories found
        </motion.p>
      )}
    </div>
  );
}

function SlideDiversity({ data }: { data: WrappedData }) {
  return (
    <div className="text-center max-w-lg mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-8 shadow-lg"
      >
        <Globe className="w-12 h-12" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm uppercase tracking-widest text-muted-foreground mb-3"
      >
        Language Diversity
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-7xl font-bold mb-3 text-gradient"
      >
        <AnimatedCounter end={data.languageDiversity} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-lg text-muted-foreground mb-6"
      >
        different languages across your repositories
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="max-w-sm mx-auto"
      >
        <LanguageChart languages={data.topLanguages} />
      </motion.div>
    </div>
  );
}

function SlideReach({ data }: { data: WrappedData }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 mb-8 shadow-lg"
      >
        <Users className="w-12 h-12" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm uppercase tracking-widest text-muted-foreground mb-6"
      >
        Followers & Reach
      </motion.p>
      <div className="flex justify-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-5xl font-bold mb-1"><AnimatedCounter end={data.followers} /></p>
          <p className="text-sm text-muted-foreground">Followers</p>
        </motion.div>
        <div className="w-px bg-white/10 self-stretch" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-5xl font-bold mb-1"><AnimatedCounter end={data.following} /></p>
          <p className="text-sm text-muted-foreground">Following</p>
        </motion.div>
        <div className="w-px bg-white/10 self-stretch" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-5xl font-bold mb-1"><AnimatedCounter end={data.totalStars} /></p>
          <p className="text-sm text-muted-foreground">Stars Earned</p>
        </motion.div>
      </div>
    </div>
  );
}

function SlideAchievements({ data }: { data: WrappedData }) {
  const unlocked = data.achievements.filter(a => a.unlocked);
  return (
    <div className="text-center max-w-lg mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-6 shadow-lg mx-auto"
      >
        <Trophy className="w-10 h-10" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold mb-6"
      >
        Achievements
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        {unlocked.length > 0 ? (
          unlocked.slice(0, 6).map((a, i) => (
            <AchievementCard key={a.id} achievement={a} delay={i * 0.1} />
          ))
        ) : (
          <p className="text-muted-foreground">No achievements unlocked yet</p>
        )}
      </motion.div>
    </div>
  );
}

function SlideSummary({ data }: { data: WrappedData }) {
  const topLang = data.topLanguages[0]?.name || "code";
  const summary = `${data.name} has built ${data.totalRepos} public repositories, earning ${data.totalStars} stars and ${data.totalForks} forks. ${topLang} is the primary language. With ${data.followers} followers and ${data.accountAge} years on GitHub, they've earned the ${data.personality.type} personality.`;

  return (
    <div className="text-center max-w-xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 mb-6 shadow-lg"
      >
        <Sparkles className="w-10 h-10" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold mb-6"
      >
        Year in Review
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-strong rounded-2xl p-6 mb-6"
      >
        <p className="text-lg leading-relaxed text-muted-foreground">
          {summary}
        </p>
      </motion.div>
    </div>
  );
}

function SlideShare({ data }: { data: WrappedData }) {
  const topLang = data.topLanguages[0]?.name || "Code";
  return (
    <div className="text-center max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-8 inline-block"
      >
        <Avatar className="w-20 h-20 ring-4 ring-purple-500/50 ring-offset-4 ring-offset-black mx-auto">
          <AvatarImage src={data.avatarUrl} alt={data.name} />
          <AvatarFallback className="text-2xl">{data.name[0]}</AvatarFallback>
        </Avatar>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-2"
      >
        {data.name}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground mb-6"
      >
        @{data.username}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-xl p-6 space-y-3"
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Repositories</span>
          <span className="font-bold">{data.totalRepos}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Stars</span>
          <span className="font-bold">{data.totalStars}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Top Language</span>
          <span className="font-bold">{topLang}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Personality</span>
          <span className="font-bold text-gradient">{data.personality.type}</span>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xs text-muted-foreground mt-6"
      >
        Generate your own at github-wrapped.app
      </motion.p>
    </div>
  );
}
