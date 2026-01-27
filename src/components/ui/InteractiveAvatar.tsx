import { useRef, useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from '../../hooks';

interface InteractiveAvatarProps {
  src: string;
  alt: string;
  className?: string;
}

export function InteractiveAvatar({ 
  src, 
  alt, 
  className = '' 
}: InteractiveAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isSpinning, setIsSpinning] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  // Physics constants - reduced for mobile
  const friction = 0.95;
  const springStrength = isMobile ? 0.15 : 0.08;
  const dampening = 0.9;

  // Handle mouse/touch start
  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setIsSpinning(false);
    lastPosition.current = { x: clientX, y: clientY };
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Handle mouse/touch move
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;

    const deltaX = clientX - lastPosition.current.x;
    const deltaY = clientY - lastPosition.current.y;

    // Reduced movement range for mobile
    const maxRotation = isMobile ? 30 : 60;
    const maxPosition = isMobile ? 20 : 50;
    const rotationMultiplier = isMobile ? 0.3 : 0.5;
    const positionMultiplier = isMobile ? 0.15 : 0.3;

    setRotation(prev => ({
      x: Math.max(-maxRotation, Math.min(maxRotation, prev.x - deltaY * rotationMultiplier)),
      y: Math.max(-maxRotation, Math.min(maxRotation, prev.y + deltaX * rotationMultiplier))
    }));

    setPosition(prev => ({
      x: Math.max(-maxPosition, Math.min(maxPosition, prev.x + deltaX * positionMultiplier)),
      y: Math.max(-maxPosition, Math.min(maxPosition, prev.y + deltaY * positionMultiplier))
    }));

    setVelocity({ x: deltaX, y: deltaY });
    lastPosition.current = { x: clientX, y: clientY };
  }, [isDragging, isMobile]);

  // Handle mouse/touch end
  const handleEnd = useCallback(() => {
    setIsDragging(false);
    
    // Check if we should spin
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    if (speed > 10) {
      setIsSpinning(true);
    }
  }, [velocity]);

  // Physics animation loop - only runs when needed
  useEffect(() => {
    if (isDragging) return;
    
    // Don't animate if everything is at rest
    const isAtRest = 
      Math.abs(velocity.x) < 0.1 && 
      Math.abs(velocity.y) < 0.1 && 
      Math.abs(rotation.x) < 0.1 && 
      Math.abs(rotation.y) < 0.1 &&
      Math.abs(position.x) < 0.1 &&
      Math.abs(position.y) < 0.1;
    
    if (isAtRest && !isSpinning) {
      // Reset to exact zero to prevent micro-animations
      if (rotation.x !== 0 || rotation.y !== 0) setRotation({ x: 0, y: 0 });
      if (position.x !== 0 || position.y !== 0) setPosition({ x: 0, y: 0 });
      return;
    }

    const animate = () => {
      setVelocity(prev => ({
        x: prev.x * friction,
        y: prev.y * friction
      }));

      setRotation(prev => {
        const newX = prev.x + velocity.y * 0.3;
        const newY = prev.y + velocity.x * 0.3;
        
        const springX = isSpinning ? newX : newX * dampening - newX * springStrength;
        const springY = isSpinning ? newY : newY * dampening - newY * springStrength;
        
        return {
          x: Math.abs(springX) < 0.1 ? 0 : springX,
          y: Math.abs(springY) < 0.1 ? 0 : springY
        };
      });

      setPosition(prev => ({
        x: prev.x * dampening - prev.x * springStrength,
        y: prev.y * dampening - prev.y * springStrength
      }));

      if (Math.abs(velocity.x) < 0.1 && Math.abs(velocity.y) < 0.1) {
        setIsSpinning(false);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDragging, velocity, isSpinning, rotation, position]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Touch events - with passive option for better mobile performance
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't prevent default to allow normal page scrolling
    const touch = e.touches[0];
    if (touch) {
      handleStart(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Only prevent default if actively dragging to avoid scroll interference
    if (isDragging) {
      e.stopPropagation();
    }
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (_e: React.TouchEvent) => {
    handleEnd();
  };

  // Double click to spin
  const handleDoubleClick = () => {
    setIsSpinning(true);
    setVelocity({ x: 30, y: 0 });
  };

  return (
    <div 
      ref={containerRef}
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{
        perspective: '1000px',
        touchAction: 'pan-y', // Allow vertical scrolling, capture horizontal
        WebkitUserSelect: 'none',
        userSelect: 'none',
        overflow: 'visible',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
    >
      {/* Glow effect - simplified for performance */}
      <div 
        className="absolute rounded-full blur-2xl pointer-events-none"
        style={{
          inset: isMobile ? '-10%' : '-20%',
          background: `radial-gradient(circle, var(--color-accent) 0%, var(--color-secondary) 50%, transparent 70%)`,
          opacity: isDragging ? 0.5 : 0.25,
          willChange: isDragging ? 'transform, opacity' : 'auto',
        }}
      />
      
      {/* Ring effects */}
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: '-4px',
          background: `conic-gradient(from ${rotation.y * 2}deg, var(--color-accent), var(--color-secondary), var(--color-accent))`,
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          willChange: isDragging ? 'transform' : 'auto',
        }}
      />
      
      {/* Inner dark ring */}
      <div 
        className="absolute rounded-full bg-[var(--color-dark-bg)] pointer-events-none"
        style={{
          inset: '3px',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          willChange: isDragging ? 'transform' : 'auto',
        }}
      />

      {/* Avatar image */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translate(${position.x}px, ${position.y}px)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          willChange: isDragging ? 'transform' : 'auto',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager"
          draggable={false}
        />
        
        {/* Shine effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              ${135 + rotation.y}deg, 
              rgba(255,255,255,0.3) 0%, 
              transparent 50%, 
              rgba(0,0,0,0.2) 100%
            )`,
          }}
        />
      </div>

      {/* Floating particles when dragging - hidden on mobile for performance */}
      {isDragging && !isMobile && (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[var(--color-accent)] animate-ping pointer-events-none"
              style={{
                top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 60}%`,
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </>
      )}

      {/* Hint text - hidden on mobile */}
      {!isMobile && (
        <div 
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#64748b] whitespace-nowrap transition-opacity duration-300 pointer-events-none"
          style={{ opacity: isDragging ? 0 : 0.5 }}
        >
          Arraste ou clique duas vezes
        </div>
      )}
    </div>
  );
}
