'use client';

export default function DarkModeToggle({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
      style={{ background: 'var(--fill-secondary)' }}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      <span className="text-lg">{dark ? '☀️' : '🌙'}</span>
    </button>
  );
}
