'use client';

/* ─── Base Shimmer Bone ─── */
function Bone({ className = '' }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(212,175,55,0.07) 50%, rgba(255,255,255,0.04) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s ease-in-out infinite',
      }}
    />
  );
}

/* ─── Metric Card Skeleton ─── */
export function MetricCardSkeleton() {
  return (
    <div className="rounded-2xl p-6"
      style={{
        background: 'rgba(17,24,39,0.5)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3 pr-4">
          <Bone className="h-3 w-20" />
          <Bone className="h-8 w-14" />
          <Bone className="h-3 w-28" />
        </div>
        <Bone className="w-12 h-12 rounded-xl flex-shrink-0" />
      </div>
    </div>
  );
}

/* ─── Match Card Skeleton ─── */
export function MatchCardSkeleton() {
  return (
    <div className="rounded-2xl p-5"
      style={{
        background: 'rgba(17,24,39,0.5)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
      <div className="flex items-start gap-4 mb-4">
        <Bone className="w-14 h-14 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2.5">
          <Bone className="h-4 w-32" />
          <Bone className="h-3 w-24" />
          <Bone className="h-3 w-20" />
        </div>
        <Bone className="w-16 h-16 rounded-full flex-shrink-0" />
      </div>
      <Bone className="h-3 w-full mb-2" />
      <Bone className="h-3 w-4/5 mb-4" />
      <div className="flex gap-2 mb-5">
        <Bone className="h-6 w-20 rounded-full" />
        <Bone className="h-6 w-16 rounded-full" />
        <Bone className="h-6 w-18 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Bone className="h-10 flex-1 rounded-xl" />
        <Bone className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

/* ─── Activity Card Skeleton ─── */
export function ActivityCardSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <Bone className="w-8 h-8 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Bone className="h-3.5 w-3/4" />
        <Bone className="h-3 w-1/2" />
        <Bone className="h-2.5 w-1/4" />
      </div>
    </div>
  );
}

/* ─── Startup Card Skeleton ─── */
export function StartupCardSkeleton() {
  return (
    <div className="rounded-2xl p-6"
      style={{
        background: 'rgba(17,24,39,0.5)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <Bone className="h-5 w-32" />
          <Bone className="h-6 w-14 rounded-lg" />
        </div>
        <Bone className="w-10 h-10 rounded-xl" />
      </div>
      <Bone className="h-3 w-full mb-1.5" />
      <Bone className="h-3 w-5/6 mb-5" />
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <Bone className="h-3 w-16" />
          <Bone className="h-3 w-8" />
        </div>
        <Bone className="h-2 w-full rounded-full" />
      </div>
      <div className="flex gap-1.5 mb-4">
        {[1, 2, 3].map(i => <Bone key={i} className="w-7 h-7 rounded-full" />)}
      </div>
      <div className="space-y-2 pt-4 border-t border-white/5">
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-5/6" />
        <Bone className="h-3 w-4/6" />
      </div>
    </div>
  );
}

/* ─── Generic Table Skeleton ─── */
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <Bone className="w-8 h-8 rounded-lg" />
          <Bone className="h-3 flex-1" />
          <Bone className="h-3 w-24" />
          <Bone className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
