'use client';

export default function SkeletonList() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-4 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <div className="skeleton w-5 h-5 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
          </div>
          <div className="skeleton h-6 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}
