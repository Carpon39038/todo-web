'use client';

export default function DarkModeToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle}
      className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
      style={{ background: 'var(--fill3)' }}
    >
      <span className="text-[15px]">{dark ? '☀️' : '🌙'}</span>
    </button>
  );
}
