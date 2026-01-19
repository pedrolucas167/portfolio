import { useEffect, useRef, useState } from 'react';

interface ParallaxConfig {
  speed?: number;
  direction?: 'up' | 'down';
  easing?: boolean;
}

interface ParallaxReturn {
  ref: React.RefObject<HTMLElement | null>;
  offset: number;
  progress: number;
}

export function useParallax(config: ParallaxConfig = {}): ParallaxReturn {
  const { speed = 0.5, direction = 'up', easing = true } = config;
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrameId: number;
    let currentOffset = 0;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const distanceFromCenter = elementCenter - windowHeight / 2;
        
        // Calculate progress (0 to 1) based on element visibility
        const viewportProgress = Math.max(0, Math.min(1, 
          (windowHeight - rect.top) / (windowHeight + rect.height)
        ));
        
        let targetOffset = distanceFromCenter * speed * (direction === 'up' ? -1 : 1);
        
        if (easing) {
          currentOffset += (targetOffset - currentOffset) * 0.1;
          setOffset(currentOffset);
        } else {
          setOffset(targetOffset);
        }
        
        setProgress(viewportProgress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [speed, direction, easing]);

  return { ref, offset, progress };
}
