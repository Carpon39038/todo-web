import { useState, useEffect, useCallback, useRef } from 'react';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined as unknown as ReturnType<typeof setTimeout>);

  useEffect(() => {
    timer.current = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(timer.current);
  }, [query]);

  return { query, debounced, setQuery };
}
