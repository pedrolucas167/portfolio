import { useCallback, useEffect, useRef } from 'react';

interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
}

export function useSmoothScroll() {
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const scrollTo = useCallback((target: string | HTMLElement, options: SmoothScrollOptions = {}) => {
    cancelAnimationFrame(frame.current);
    const { offset = 80, duration = 1000 } = options;

    const element = typeof target === 'string'
      ? document.querySelector(target)
      : target;

    if (!element) return;

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
    if (duration <= 0) { window.scrollTo(0, targetPosition); return; }
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

      if (timeElapsed < duration) {
        frame.current = requestAnimationFrame(animation);
      }
    };

    frame.current = requestAnimationFrame(animation);
  }, []);

  return { scrollTo };
}
