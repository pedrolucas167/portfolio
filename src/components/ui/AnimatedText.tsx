import { useEffect, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  animation?: 'fade-up' | 'fade-in' | 'slide-in' | 'wave';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export function AnimatedText({ 
  text, 
  className = '', 
  delay = 0,
  staggerDelay = 50,
  animation = 'fade-up',
  as: Component = 'span'
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const letters = text.split('');

  const getAnimationStyle = (index: number) => {
    const baseDelay = delay + (index * staggerDelay);
    
    if (!isVisible) {
      return {
        opacity: 0,
        transform: animation === 'fade-up' ? 'translateY(20px)' : 
                   animation === 'slide-in' ? 'translateX(-20px)' :
                   animation === 'wave' ? 'translateY(0px)' : 'none',
      };
    }

    return {
      opacity: 1,
      transform: 'translateY(0) translateX(0)',
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay}ms`,
    };
  };

  return (
    <Component className={className} aria-label={text}>
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            whiteSpace: letter === ' ' ? 'pre' : 'normal',
            ...getAnimationStyle(index),
          }}
          aria-hidden="true"
        >
          {letter}
        </span>
      ))}
    </Component>
  );
}
