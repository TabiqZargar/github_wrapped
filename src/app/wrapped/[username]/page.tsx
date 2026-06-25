"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useWrappedData } from "@/hooks/useWrappedData";
import { WrappedSlides } from "@/components/WrappedSlides";
import { WrappedSkeleton } from "@/components/LoadingSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

export default function WrappedUsernamePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter();
  const { data, loading, error } = useWrappedData(username);

  if (loading) return <WrappedSkeleton />;

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" /> Home
            </Button>
            <Button variant="gradient" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <ErrorBoundary>
      <div className="relative">
        <button
          onClick={() => router.push("/")}
          className="fixed top-4 left-4 z-[60] flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-xl border border-white/10 text-sm text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </button>
        <WrappedSlides data={data} />
      </div>
    </ErrorBoundary>
  );
}
