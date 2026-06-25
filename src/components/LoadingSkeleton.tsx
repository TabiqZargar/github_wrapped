"use client";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skeleton h-[300px] rounded-xl" />
        <div className="skeleton h-[300px] rounded-xl" />
      </div>
    </div>
  );
}

export function WrappedSkeleton() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="skeleton w-28 h-28 rounded-full mx-auto" />
        <div className="skeleton h-8 w-48 mx-auto rounded" />
        <div className="skeleton h-4 w-32 mx-auto rounded" />
      </div>
    </div>
  );
}
