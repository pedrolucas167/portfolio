import { useRef, useState, useEffect } from 'react';

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

interface RevealReturn {
  ref: React.RefObject<HTMLElement | null>;
  isRevealed: boolean;
  progress: number;
}

export function useReveal(options: RevealOptions = {}): RevealReturn {
  const { 
    threshold = 0.1, 
    rootMargin = '0px', 
    triggerOnce = true,
    delay = 0 
  } = options;
  
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setProgress(entry.intersectionRatio);
          
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => setIsRevealed(true), delay);
            } else {
              setIsRevealed(true);
            }
            
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsRevealed(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay]);

  return { ref, isRevealed, progress };
}
