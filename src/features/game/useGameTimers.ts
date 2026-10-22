import { useCallback, useEffect, useRef } from 'react';
export function useGameTimers() {
  const keyed = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const clearTimers = useCallback(() => { timers.current.forEach(clearTimeout); timers.current.clear(); keyed.current.clear(); }, []);
  const schedule = useCallback((callback: () => void, delay: number, key?: string) => {
    if (key) { const previous = keyed.current.get(key); if (previous) { clearTimeout(previous); timers.current.delete(previous); } }
    const timer = setTimeout(() => { timers.current.delete(timer); if (key) keyed.current.delete(key); callback(); }, delay);
    timers.current.add(timer);
    if (key) keyed.current.set(key, timer);
  }, []);
  useEffect(() => clearTimers, [clearTimers]);
  return { schedule, clearTimers };
}
