'use client';

export default function SkeletonList() {
  return (
    <div className="a-list">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="a-list-item">
          <div className="skeleton w-[22px] h-[22px] rounded-full" />
          <div className="flex-1 space-y-2.5 py-0.5">
            <div className="skeleton h-[17px] w-3/5" />
            <div className="skeleton h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
