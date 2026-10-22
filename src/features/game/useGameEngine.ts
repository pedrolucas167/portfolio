import { useCallback, useEffect, useRef, useState } from 'react';
import { useGameTimers } from './useGameTimers';
import { BUG_CONFIG, POWERUP_CONFIG, BUG_TYPES, POWERUP_TYPES, type Bug, type PowerUp, type Particle, type ScreenEffect, type GameState, type BugType } from './model';
export function useGameEngine() {
  const { schedule, clearTimers } = useGameTimers();
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
        const isMobile = window.innerWidth < 640;
        const maxWidth = Math.min(rect.width - (isMobile ? 16 : 24), isMobile ? 400 : 750);
        setDimensions({
          width: maxWidth,
          height: isMobile
            ? Math.min(320, Math.max(280, window.innerHeight * 0.38))
            : Math.min(450, Math.max(350, window.innerHeight * 0.45)),
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
            schedule(() => { slowMoRef.current = 1; }, config.duration, 'coffee');
            break;
          case 'commit':
            scoreMultiplierRef.current = 3;
            schedule(() => { scoreMultiplierRef.current = 1; }, config.duration, 'commit');
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
            schedule(() => { autoKillRef.current = false; }, config.duration, 'debug');
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
              schedule(() => {
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
    if (!gameState.isPlaying) return;

    const interval = setInterval(() => {
      if (bugsRef.current.length > 0 && autoKillRef.current) {
        const bug = bugsRef.current[0];
        if (bug) {
          handleHit(
            (canvasRef.current?.getBoundingClientRect().left ?? 0) + bug.x * ((canvasRef.current?.getBoundingClientRect().width ?? dimensions.width) / dimensions.width),
            (canvasRef.current?.getBoundingClientRect().top ?? 0) + bug.y * ((canvasRef.current?.getBoundingClientRect().height ?? dimensions.height) / dimensions.height)
          );
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [gameState.isPlaying, handleHit, dimensions]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startGame = () => {
    clearTimers();
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
    e.stopPropagation();
    const touch = e.touches[0];
    if (touch) handleHit(touch.clientX, touch.clientY);
  };


  return { schedule, canvasRef, gameState, dimensions, frameCountRef, pulseRef, cameraShakeRef, flashRef, effectsRef, lastSpawnRef, spawnBug, spawnPowerUp, comboTimerRef, setGameState, bugsRef, slowMoRef, createExplosion, addEffect, powerUpsRef, particlesRef, createParticles, scoreMultiplierRef, autoKillRef, animationIdRef, containerRef, handleMouseMove, startGame, handleMouseDown, handleTouchStart };
}
