'use client';

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative mb-5">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] opacity-50">🔍</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder="Search" className="a-input !pl-11" />
    </div>
  );
}
