import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../ui';

type BugType = 'bug' | 'error' | 'warning' | 'crash' | 'boss';
type PowerUpType = 'coffee' | 'commit' | 'deploy' | 'debug' | 'refactor';

interface Bug {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  type: BugType;
  size: number;
  speed: number;
  health: number;
  maxHealth: number;
  angle: number;
  wobble: number;
  spawnTime: number;
  hitFlash: number;
  scale: number;
}

interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: PowerUpType;
  size: number;
  spawnTime: number;
  rotation: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'glow' | 'trail' | 'explosion' | 'text' | 'ring';
  text?: string;
  rotation?: number;
}

interface ScreenEffect {
  type: 'shake' | 'flash' | 'slowmo' | 'zoom';
  intensity: number;
  duration: number;
  startTime: number;
}

interface GameState {
  score: number;
  level: number;
  lives: number;
  isPlaying: boolean;
  bugsKilled: number;
  combo: number;
  maxCombo: number;
  bossActive: boolean;
  totalDamage: number;
}

const BUG_CONFIG: Record<BugType, { emoji: string; color: string; glow: string; points: number; health: number; size: number }> = {
  bug: { emoji: '🐛', color: '#10b981', glow: '#10b98180', points: 10, health: 1, size: 32 },
  error: { emoji: '❌', color: '#ef4444', glow: '#ef444480', points: 25, health: 2, size: 36 },
  warning: { emoji: '⚠️', color: '#f59e0b', glow: '#f59e0b80', points: 15, health: 1, size: 34 },
  crash: { emoji: '💀', color: '#8b5cf6', glow: '#8b5cf680', points: 50, health: 3, size: 40 },
  boss: { emoji: '👾', color: '#ec4899', glow: '#ec489980', points: 500, health: 20, size: 72 },
};

const POWERUP_CONFIG: Record<PowerUpType, { emoji: string; color: string; glow: string; effect: string; duration: number }> = {
  coffee: { emoji: '☕', color: '#d97706', glow: '#d9770680', effect: 'Slow Motion', duration: 8000 },
  commit: { emoji: '💾', color: '#06d6a0', glow: '#06d6a080', effect: '3x Score', duration: 10000 },
  deploy: { emoji: '🚀', color: '#3b82f6', glow: '#3b82f680', effect: 'Nuke All', duration: 0 },
  debug: { emoji: '🔍', color: '#a855f7', glow: '#a855f780', effect: 'Auto-Kill', duration: 6000 },
  refactor: { emoji: '♻️', color: '#14b8a6', glow: '#14b8a680', effect: 'Extra Life', duration: 0 },
};

const BUG_TYPES: BugType[] = ['bug', 'error', 'warning', 'crash'];
const POWERUP_TYPES: PowerUpType[] = ['coffee', 'commit', 'deploy', 'debug', 'refactor'];

const easeOutElastic = (t: number): number => {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
};

const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const Game3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 500 });
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lives: 5,
    isPlaying: false,
    bugsKilled: 0,
    combo: 0,
    maxCombo: 0,
    bossActive: false,
    totalDamage: 0,
  });

  const bugsRef = useRef<Bug[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const effectsRef = useRef<ScreenEffect[]>([]);
  const animationIdRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastClickRef = useRef({ x: 0, y: 0, time: 0 });

  const slowMoRef = useRef<number>(1);
  const scoreMultiplierRef = useRef<number>(1);
  const autoKillRef = useRef<boolean>(false);
  const comboTimerRef = useRef<number>(0);

  const cameraShakeRef = useRef({ x: 0, y: 0 });
  const flashRef = useRef<number>(0);
  const pulseRef = useRef<number>(0);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const maxWidth = Math.min(rect.width - 24, 750);
        setDimensions({
          width: maxWidth,
          height: Math.min(450, Math.max(350, window.innerHeight * 0.45)),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const addEffect = useCallback((type: ScreenEffect['type'], intensity: number, duration: number) => {
    effectsRef.current.push({ type, intensity, duration, startTime: frameCountRef.current });
  }, []);

  const createParticles = useCallback((x: number, y: number, color: string, config: {
    count?: number;
    type?: Particle['type'];
    spread?: number;
    speed?: number;
    size?: number;
    text?: string;
  } = {}) => {
    const { count = 12, type = 'spark', spread = 1, speed = 4, size = 4, text } = config;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const vel = (speed + Math.random() * speed) * spread;

      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * vel,
        vy: Math.sin(angle) * vel - (type === 'explosion' ? 2 : 0),
        life: 1, maxLife: 1,
        color,
        size: size + Math.random() * size,
        type, text,
        rotation: Math.random() * Math.PI * 2,
      });
    }
  }, []);

  const createExplosion = useCallback((x: number, y: number, color: string, intensity: number = 1) => {
    createParticles(x, y, color, { count: 15 * intensity, type: 'explosion', spread: 1.5, speed: 6 });
    createParticles(x, y, '#ffffff', { count: 8 * intensity, type: 'spark', spread: 2, speed: 8, size: 2 });
    particlesRef.current.push({ x, y, vx: 0, vy: 0, life: 1, maxLife: 1, color, size: 20, type: 'ring' });
    addEffect('shake', 0.3 * intensity, 15);
    addEffect('flash', 0.2 * intensity, 8);
  }, [createParticles, addEffect]);

  const createScorePopup = useCallback((x: number, y: number, score: number, combo: number) => {
    const text = combo > 1 ? `+${score} x${combo}` : `+${score}`;
    const color = combo > 5 ? '#f59e0b' : combo > 2 ? '#06d6a0' : '#ffffff';
    particlesRef.current.push({
      x, y: y - 20,
      vx: (Math.random() - 0.5) * 2, vy: -3,
      life: 1, maxLife: 1, color,
      size: Math.min(18 + combo * 2, 32),
      type: 'text', text,
    });
  }, []);

  const spawnBug = useCallback((forceBoss = false) => {
    const { width, height } = dimensions;
    const side = Math.floor(Math.random() * 4);
    let x: number, y: number;

    switch (side) {
      case 0: x = Math.random() * width; y = -40; break;
      case 1: x = width + 40; y = Math.random() * height; break;
      case 2: x = Math.random() * width; y = height + 40; break;
      default: x = -40; y = Math.random() * height;
    }

    const isBoss = forceBoss || (gameState.level >= 3 && Math.random() < 0.02 && !gameState.bossActive);
    
    let type: BugType;
    if (isBoss) {
      type = 'boss';
      setGameState(prev => ({ ...prev, bossActive: true }));
    } else {
      const maxType = Math.min(1 + Math.floor(gameState.level / 2), BUG_TYPES.length);
      const typeIndex = Math.floor(Math.random() * maxType);
      type = BUG_TYPES[typeIndex] ?? 'bug';
    }

    const config = BUG_CONFIG[type];
    const baseSpeed = 0.4 + gameState.level * 0.08;

    bugsRef.current.push({
      id: Date.now() + Math.random(),
      x, y,
      targetX: width / 2 + (Math.random() - 0.5) * 80,
      targetY: height / 2 + (Math.random() - 0.5) * 80,
      type,
      size: config.size,
      speed: (isBoss ? baseSpeed * 0.5 : baseSpeed + Math.random() * 0.3) * slowMoRef.current,
      health: config.health + Math.floor(gameState.level / 3),
      maxHealth: config.health + Math.floor(gameState.level / 3),
      angle: 0,
      wobble: Math.random() * Math.PI * 2,
      spawnTime: frameCountRef.current,
      hitFlash: 0,
      scale: 0,
    });
  }, [dimensions, gameState.level, gameState.bossActive]);

  const spawnPowerUp = useCallback(() => {
    const { width, height } = dimensions;
    const typeIndex = Math.floor(Math.random() * POWERUP_TYPES.length);
    const type = POWERUP_TYPES[typeIndex] ?? 'coffee';

    powerUpsRef.current.push({
      id: Date.now(),
      x: 60 + Math.random() * (width - 120),
      y: 60 + Math.random() * (height - 120),
      type, size: 36,
      spawnTime: frameCountRef.current,
      rotation: 0,
    });

    const config = POWERUP_CONFIG[type];
    createParticles(60 + Math.random() * (width - 120), 60 + Math.random() * (height - 120), config.color, { count: 6, type: 'glow', size: 8 });
  }, [dimensions, createParticles]);

  const handleHit = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current || !gameState.isPlaying) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    lastClickRef.current = { x, y, time: frameCountRef.current };
    createParticles(x, y, '#ffffff40', { count: 6, type: 'spark', spread: 0.5, speed: 3, size: 2 });

    for (let i = powerUpsRef.current.length - 1; i >= 0; i--) {
      const powerUp = powerUpsRef.current[i];
      if (!powerUp) continue;
      
      const dist = Math.hypot(x - powerUp.x, y - powerUp.y);
      if (dist < powerUp.size + 10) {
        const config = POWERUP_CONFIG[powerUp.type];
        createExplosion(powerUp.x, powerUp.y, config.color, 0.5);
        powerUpsRef.current.splice(i, 1);

        particlesRef.current.push({
          x: powerUp.x, y: powerUp.y - 30, vx: 0, vy: -2,
          life: 1, maxLife: 1, color: config.color, size: 16, type: 'text', text: config.effect,
        });

        switch (powerUp.type) {
          case 'coffee':
            slowMoRef.current = 0.4;
            addEffect('slowmo', 0.5, 480);
            setTimeout(() => { slowMoRef.current = 1; }, config.duration);
            break;
          case 'commit':
            scoreMultiplierRef.current = 3;
            setTimeout(() => { scoreMultiplierRef.current = 1; }, config.duration);
            break;
          case 'deploy':
            bugsRef.current.forEach((bug) => {
              if (bug) {
                const points = BUG_CONFIG[bug.type].points * scoreMultiplierRef.current;
                setGameState(prev => ({ ...prev, score: prev.score + points, bugsKilled: prev.bugsKilled + 1 }));
                createExplosion(bug.x, bug.y, BUG_CONFIG[bug.type].color, bug.type === 'boss' ? 2 : 0.8);
              }
            });
            bugsRef.current = [];
            setGameState(prev => ({ ...prev, bossActive: false }));
            addEffect('flash', 0.8, 20);
            addEffect('shake', 1, 30);
            break;
          case 'debug':
            autoKillRef.current = true;
            setTimeout(() => { autoKillRef.current = false; }, config.duration);
            break;
          case 'refactor':
            setGameState(prev => ({ ...prev, lives: Math.min(prev.lives + 1, 7) }));
            addEffect('flash', 0.3, 10);
            break;
        }
        return;
      }
    }

    for (let i = bugsRef.current.length - 1; i >= 0; i--) {
      const bug = bugsRef.current[i];
      if (!bug) continue;
      
      const dist = Math.hypot(x - bug.x, y - bug.y);
      if (dist < bug.size + 5) {
        bug.health--;
        bug.hitFlash = 10;
        createParticles(x, y, BUG_CONFIG[bug.type].color, { count: 6, type: 'spark', spread: 1, speed: 5 });

        if (bug.health <= 0) {
          const basePoints = BUG_CONFIG[bug.type].points;
          const comboBonus = Math.floor(gameState.combo * 5);
          const points = (basePoints + comboBonus) * scoreMultiplierRef.current;
          
          setGameState(prev => {
            const newCombo = prev.combo + 1;
            return {
              ...prev,
              score: prev.score + points,
              bugsKilled: prev.bugsKilled + 1,
              combo: newCombo,
              maxCombo: Math.max(prev.maxCombo, newCombo),
              totalDamage: prev.totalDamage + BUG_CONFIG[bug.type].health,
              bossActive: bug.type === 'boss' ? false : prev.bossActive,
            };
          });

          comboTimerRef.current = 90;
          createExplosion(bug.x, bug.y, BUG_CONFIG[bug.type].color, bug.type === 'boss' ? 2.5 : 1);
          createScorePopup(bug.x, bug.y, points, gameState.combo + 1);

          if (bug.type === 'boss') {
            addEffect('shake', 1.5, 40);
            addEffect('flash', 0.6, 15);
            for (let j = 0; j < 5; j++) {
              setTimeout(() => {
                createExplosion(bug.x + (Math.random() - 0.5) * 60, bug.y + (Math.random() - 0.5) * 60, '#ec4899', 0.5);
              }, j * 80);
            }
          }

          bugsRef.current.splice(i, 1);
        } else {
          addEffect('shake', 0.15, 5);
        }
        return;
      }
    }

    if (gameState.combo > 2) {
      particlesRef.current.push({
        x, y: y - 10, vx: 0, vy: -1, life: 1, maxLife: 1,
        color: '#ef4444', size: 14, type: 'text', text: 'MISS!',
      });
    }
    setGameState(prev => ({ ...prev, combo: 0 }));
  }, [gameState.isPlaying, gameState.combo, createParticles, createExplosion, createScorePopup, addEffect]);

  useEffect(() => {
    if (!autoKillRef.current || !gameState.isPlaying) return;

    const interval = setInterval(() => {
      if (bugsRef.current.length > 0 && autoKillRef.current) {
        const bug = bugsRef.current[0];
        if (bug) {
          handleHit(
            (canvasRef.current?.getBoundingClientRect().left ?? 0) + bug.x,
            (canvasRef.current?.getBoundingClientRect().top ?? 0) + bug.y
          );
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [gameState.isPlaying, handleHit]);

  useEffect(() => {
    if (!gameState.isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    const gameLoop = () => {
      frameCountRef.current++;
      const frame = frameCountRef.current;
      pulseRef.current = Math.sin(frame * 0.05) * 0.5 + 0.5;

      cameraShakeRef.current = { x: 0, y: 0 };
      flashRef.current = 0;
      let timeScale = 1;

      for (let i = effectsRef.current.length - 1; i >= 0; i--) {
        const effect = effectsRef.current[i];
        if (!effect) continue;
        
        const elapsed = frame - effect.startTime;
        const progress = elapsed / effect.duration;

        if (progress >= 1) {
          effectsRef.current.splice(i, 1);
          continue;
        }

        const ease = 1 - progress;

        switch (effect.type) {
          case 'shake':
            cameraShakeRef.current.x += (Math.random() - 0.5) * effect.intensity * ease * 15;
            cameraShakeRef.current.y += (Math.random() - 0.5) * effect.intensity * ease * 15;
            break;
          case 'flash':
            flashRef.current = Math.max(flashRef.current, effect.intensity * ease);
            break;
          case 'slowmo':
            timeScale = 0.3 + 0.7 * progress;
            break;
        }
      }

      ctx.save();
      ctx.translate(cameraShakeRef.current.x, cameraShakeRef.current.y);

      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width);
      bgGradient.addColorStop(0, '#1e293b');
      bgGradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(-10, -10, width + 20, height + 20);

      ctx.strokeStyle = `rgba(30, 41, 59, ${0.3 + pulseRef.current * 0.2})`;
      ctx.lineWidth = 1;
      const gridOffset = (frame * 0.5) % 40;
      for (let gx = -40 + gridOffset; gx < width + 40; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = -40 + gridOffset; gy < height + 40; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      const spawnRate = Math.max(25, 80 - gameState.level * 4);
      if (frame - lastSpawnRef.current > spawnRate / timeScale) {
        spawnBug();
        lastSpawnRef.current = frame;
        if (Math.random() < 0.12 + gameState.level * 0.01) {
          spawnPowerUp();
        }
      }

      if (comboTimerRef.current > 0) {
        comboTimerRef.current -= timeScale;
        if (comboTimerRef.current <= 0) {
          setGameState(prev => ({ ...prev, combo: 0 }));
        }
      }

      const dangerPulse = 0.15 + Math.sin(frame * 0.1) * 0.1;
      const dangerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
      dangerGradient.addColorStop(0, 'transparent');
      dangerGradient.addColorStop(0.7, `rgba(239, 68, 68, ${dangerPulse * 0.3})`);
      dangerGradient.addColorStop(1, `rgba(239, 68, 68, ${dangerPulse})`);
      ctx.fillStyle = dangerGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 20;
      ctx.shadowColor = '#06d6a0';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💻', centerX, centerY);
      ctx.shadowBlur = 0;

      for (let i = bugsRef.current.length - 1; i >= 0; i--) {
        const bug = bugsRef.current[i];
        if (!bug) continue;

        const age = frame - bug.spawnTime;
        if (bug.scale < 1) {
          bug.scale = Math.min(1, easeOutBack(age / 20));
        }

        if (bug.hitFlash > 0) bug.hitFlash -= 1;

        const dx = bug.targetX - bug.x;
        const dy = bug.targetY - bug.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 10) {
          const speed = bug.speed * timeScale * slowMoRef.current;
          bug.x += (dx / dist) * speed;
          bug.y += (dy / dist) * speed;
          bug.wobble += 0.08 * timeScale;
          bug.x += Math.sin(bug.wobble) * 0.8;
          bug.y += Math.cos(bug.wobble * 0.7) * 0.4;
          bug.angle = Math.atan2(dy, dx);
        } else {
          setGameState(prev => {
            const newLives = prev.lives - (bug.type === 'boss' ? 2 : 1);
            if (newLives <= 0) {
              return { ...prev, lives: 0, isPlaying: false };
            }
            return { ...prev, lives: newLives, combo: 0 };
          });
          createExplosion(bug.x, bug.y, '#ef4444', 1.5);
          addEffect('shake', 0.8, 20);
          addEffect('flash', 0.4, 10);
          bugsRef.current.splice(i, 1);
          continue;
        }

        const config = BUG_CONFIG[bug.type];
        const drawSize = bug.size * bug.scale;

        ctx.shadowBlur = 25 + Math.sin(frame * 0.1 + bug.id) * 10;
        ctx.shadowColor = config.glow;

        if (bug.hitFlash > 0) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(bug.x, bug.y, drawSize * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        if (bug.type === 'boss' && frame % 3 === 0) {
          particlesRef.current.push({
            x: bug.x + (Math.random() - 0.5) * 20,
            y: bug.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1, maxLife: 1,
            color: config.color, size: 6, type: 'trail',
          });
        }

        if (bug.maxHealth > 1) {
          const barWidth = drawSize * 1.2;
          const barHeight = 6;
          const barY = bug.y - drawSize * 0.8 - 14;
          
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(bug.x - barWidth / 2 - 1, barY - 1, barWidth + 2, barHeight + 2);
          
          const healthGradient = ctx.createLinearGradient(bug.x - barWidth / 2, 0, bug.x + barWidth / 2, 0);
          healthGradient.addColorStop(0, config.color);
          healthGradient.addColorStop(1, config.glow);
          ctx.fillStyle = healthGradient;
          ctx.fillRect(bug.x - barWidth / 2, barY, barWidth * (bug.health / bug.maxHealth), barHeight);
        }

        ctx.font = `${drawSize * 0.9}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (bug.type === 'boss') {
          ctx.save();
          ctx.translate(bug.x, bug.y);
          ctx.rotate(Math.sin(frame * 0.05) * 0.1);
          ctx.fillText(config.emoji, 0, 0);
          ctx.restore();
        } else {
          ctx.fillText(config.emoji, bug.x, bug.y);
        }
        
        ctx.shadowBlur = 0;
      }

      for (const powerUp of powerUpsRef.current) {
        if (!powerUp) continue;
        
        const config = POWERUP_CONFIG[powerUp.type];
        const age = frame - powerUp.spawnTime;
        const scale = easeOutElastic(Math.min(age / 30, 1));
        const pulse = 1 + Math.sin(frame * 0.08) * 0.12;
        powerUp.rotation += 0.02;

        const glowSize = powerUp.size * 2 * pulse;
        const gradient = ctx.createRadialGradient(powerUp.x, powerUp.y, 0, powerUp.x, powerUp.y, glowSize);
        gradient.addColorStop(0, config.color + '40');
        gradient.addColorStop(0.5, config.color + '20');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = config.color + '60';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, powerUp.size * 1.3 * scale, powerUp.rotation, powerUp.rotation + Math.PI * 1.5);
        ctx.stroke();

        ctx.font = `${powerUp.size * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.emoji, powerUp.x, powerUp.y);
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        if (!p) continue;

        p.x += p.vx * timeScale;
        p.y += p.vy * timeScale;
        p.life -= 0.025 * timeScale;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const alpha = p.life;

        switch (p.type) {
          case 'spark':
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'explosion':
            p.vy += 0.15;
            ctx.globalAlpha = alpha * 0.8;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (0.5 + alpha * 0.5), 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'glow':
            ctx.globalAlpha = alpha * 0.5;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (2 - alpha), 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'trail':
            ctx.globalAlpha = alpha * 0.6;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'ring':
            ctx.globalAlpha = alpha * 0.6;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 3 * alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (3 - alpha * 2), 0, Math.PI * 2);
            ctx.stroke();
            break;

          case 'text':
            p.vy -= 0.02;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.font = `bold ${p.size}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.text || '', p.x, p.y);
            break;
        }
        ctx.globalAlpha = 1;
      }

      const bugsNeeded = gameState.level * 12;
      if (gameState.bugsKilled >= bugsNeeded) {
        setGameState(prev => ({ ...prev, level: prev.level + 1 }));
        addEffect('flash', 0.3, 15);
        
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            createParticles(
              Math.random() * width,
              Math.random() * height,
              ['#06d6a0', '#3b82f6', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 4)] ?? '#06d6a0',
              { count: 5, type: 'spark', spread: 1.5 }
            );
          }, i * 30);
        }
      }

      ctx.restore();

      const hudGradient = ctx.createLinearGradient(0, 0, 0, 70);
      hudGradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      hudGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = hudGradient;
      ctx.fillRect(0, 0, width, 70);

      ctx.shadowBlur = 12;
      ctx.shadowColor = '#06d6a0';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${gameState.score.toLocaleString()}`, 18, 35);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('SCORE', 18, 52);

      const levelX = width / 2;
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(levelX - 40, 10, 80, 34, 17);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`LVL ${gameState.level}`, levelX, 32);

      ctx.textAlign = 'right';
      ctx.font = '22px Arial';
      const livesText = '❤️'.repeat(gameState.lives) + '🖤'.repeat(Math.max(0, 5 - gameState.lives));
      ctx.fillText(livesText, width - 18, 35);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('LIVES', width - 18, 52);

      if (gameState.combo > 1) {
        const comboScale = Math.min(1 + gameState.combo * 0.05, 1.5);
        const comboAlpha = 0.7 + Math.sin(frame * 0.15) * 0.3;
        const comboColor = gameState.combo > 10 ? '#f59e0b' : gameState.combo > 5 ? '#ec4899' : '#06d6a0';
        
        ctx.globalAlpha = comboAlpha;
        ctx.fillStyle = comboColor;
        ctx.font = `bold ${28 * comboScale}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(`${gameState.combo}x COMBO`, centerX, 90);
        
        const comboBarWidth = Math.min(gameState.combo * 12, 240);
        ctx.fillStyle = comboColor + '40';
        ctx.fillRect(centerX - comboBarWidth / 2, 102, comboBarWidth, 5);
        ctx.globalAlpha = 1;
      }

      let indicatorY = height - 30;
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      
      if (slowMoRef.current < 1) {
        ctx.fillStyle = POWERUP_CONFIG.coffee.color;
        ctx.fillText('☕ SLOW MOTION', 18, indicatorY);
        indicatorY -= 22;
      }
      if (scoreMultiplierRef.current > 1) {
        ctx.fillStyle = POWERUP_CONFIG.commit.color;
        ctx.fillText('💾 3X SCORE', 18, indicatorY);
        indicatorY -= 22;
      }
      if (autoKillRef.current) {
        ctx.fillStyle = POWERUP_CONFIG.debug.color;
        ctx.fillText('🔍 AUTO-DEBUG', 18, indicatorY);
      }

      if (gameState.bossActive) {
        const warningPulse = Math.sin(frame * 0.15) > 0;
        if (warningPulse) {
          ctx.fillStyle = '#ec4899';
          ctx.font = 'bold 16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('⚠️ BOSS ACTIVE ⚠️', centerX, height - 20);
        }
      }

      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashRef.current})`;
        ctx.fillRect(0, 0, width, height);
      }

      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationIdRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationIdRef.current);
  }, [gameState, dimensions, spawnBug, spawnPowerUp, createParticles, createExplosion, addEffect]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startGame = () => {
    bugsRef.current = [];
    powerUpsRef.current = [];
    particlesRef.current = [];
    effectsRef.current = [];
    slowMoRef.current = 1;
    scoreMultiplierRef.current = 1;
    autoKillRef.current = false;
    comboTimerRef.current = 0;
    frameCountRef.current = 0;
    lastSpawnRef.current = 0;

    setGameState({
      score: 0, level: 1, lives: 5, isPlaying: true,
      bugsKilled: 0, combo: 0, maxCombo: 0, bossActive: false, totalDamage: 0,
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => handleHit(e.clientX, e.clientY);
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch) handleHit(touch.clientX, touch.clientY);
  };

  return (
    <section id="game" className="relative py-14 md:py-18 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="relative z-10 section-container">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 rounded-full text-base font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 mb-4">
            🎮 Arcade Mode
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Bug <span className="text-gradient-animated">Hunter</span>
            <span className="text-lg text-[#64748b] font-normal ml-2">PRO</span>
          </h2>
          <p className="text-[#94a3b8] text-base">
            Defenda seu código. Destrua os bugs. Sobreviva.
          </p>
        </div>

        <div ref={containerRef} className="max-w-4xl mx-auto px-3">
          <div className="glass-card-premium p-4 md:p-5 rounded-2xl">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                className="w-full cursor-crosshair touch-none block"
                style={{ background: '#0f172a' }}
              />

              {!gameState.isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/95 to-[#0f172a]/98 flex flex-col items-center justify-center backdrop-blur-sm overflow-hidden">
                  {gameState.lives === 0 ? (
                    <div className="text-center px-6 w-full max-w-md mx-auto">
                      <div className="text-6xl mb-3 animate-bounce">💀</div>
                      <h3 className="text-4xl font-bold text-white mb-3">GAME OVER</h3>
                      <div className="grid grid-cols-2 gap-3 text-center mb-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-2xl font-bold text-[#06d6a0]">{gameState.score.toLocaleString()}</div>
                          <div className="text-sm text-[#64748b] uppercase">Score</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-2xl font-bold text-[#ec4899]">{gameState.maxCombo}x</div>
                          <div className="text-sm text-[#64748b] uppercase">Max Combo</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-2xl font-bold text-[#3b82f6]">{gameState.bugsKilled}</div>
                          <div className="text-sm text-[#64748b] uppercase">Bugs Fixed</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="text-2xl font-bold text-[#f59e0b]">{gameState.level}</div>
                          <div className="text-sm text-[#64748b] uppercase">Level</div>
                        </div>
                      </div>
                      <Button onClick={startGame} variant="primary" size="md">
                        🔄 Tentar Novamente
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center px-4 w-full max-w-lg mx-auto overflow-y-auto max-h-full py-4">
                      <div className="text-5xl mb-2">🐛</div>
                      <h3 className="text-3xl font-bold text-white mb-2">Bug Hunter</h3>
                      <p className="text-[#94a3b8] text-sm mb-4">Defenda seu código contra invasores</p>
                      
                      <div className="bg-white/5 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🐛</span>
                            <span className="text-[#94a3b8]">10 pts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">⚠️</span>
                            <span className="text-[#94a3b8]">15 pts</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">❌</span>
                            <span className="text-[#94a3b8]">25 pts (2 hits)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">💀</span>
                            <span className="text-[#94a3b8]">50 pts (3 hits)</span>
                          </div>
                          <div className="flex items-center gap-2 col-span-2 justify-center">
                            <span className="text-xl">👾</span>
                            <span className="text-[#ec4899] font-semibold">BOSS 500 pts</span>
                          </div>
                        </div>
                        
                        <div className="border-t border-white/10 mt-3 pt-3">
                          <h5 className="text-sm font-semibold text-white mb-2">Power-Ups</h5>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-lg">☕</span>
                              <span className="text-[#d97706]">Slow</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-lg">💾</span>
                              <span className="text-[#06d6a0]">3x Score</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-lg">🚀</span>
                              <span className="text-[#3b82f6]">Nuke</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-lg">🔍</span>
                              <span className="text-[#a855f7]">Auto</span>
                            </div>
                            <div className="flex items-center gap-1 col-span-2">
                              <span className="text-lg">♻️</span>
                              <span className="text-[#14b8a6]">+1 Life</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button onClick={startGame} variant="primary" size="md">
                        🚀 Iniciar Missão
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {gameState.isPlaying && (
              <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-4 text-sm text-[#94a3b8]">
                  <span>🎯 {gameState.bugsKilled} eliminados</span>
                  <span>🔥 Melhor: {gameState.maxCombo}x</span>
                </div>
                <div className="text-sm text-[#94a3b8]">
                  Próximo nível: {Math.max(0, gameState.level * 12 - gameState.bugsKilled)} bugs
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game3D;
