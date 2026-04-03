'use client';

export function SkeletonLoader({ className = '' }) {
  return (
    <div className={`animate-pulse bg-zinc-800 rounded ${className}`} />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <SkeletonLoader className="h-4 w-24" />
          <SkeletonLoader className="h-8 w-16" />
          <SkeletonLoader className="h-3 w-32" />
        </div>
        <SkeletonLoader className="w-12 h-12 rounded-lg" />
      </div>
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
      <div className="flex items-start gap-4">
        <SkeletonLoader className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-3">
          <SkeletonLoader className="h-5 w-32" />
          <SkeletonLoader className="h-4 w-24" />
          <SkeletonLoader className="h-4 w-full" />
          <div className="flex gap-2">
            <SkeletonLoader className="h-6 w-20 rounded-full" />
            <SkeletonLoader className="h-6 w-20 rounded-full" />
            <SkeletonLoader className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex gap-2">
            <SkeletonLoader className="h-10 flex-1 rounded" />
            <SkeletonLoader className="h-10 flex-1 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4">
      <SkeletonLoader className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-3 w-1/2" />
      </div>
    </div>
  );
}
