'use client';

export default function SkeletonList() {
  return (
    <div className="space-y-0 stagger">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-4" style={{ background: 'var(--bg-elevated)' }}>
          <div className="skeleton w-6 h-6 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="skeleton h-[17px] w-2/3 rounded-md" />
            <div className="skeleton h-3 w-1/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
