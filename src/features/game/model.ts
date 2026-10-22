export type BugType = 'bug' | 'error' | 'warning' | 'crash' | 'boss';
export type PowerUpType = 'coffee' | 'commit' | 'deploy' | 'debug' | 'refactor';

export interface Bug {
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

export interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: PowerUpType;
  size: number;
  spawnTime: number;
  rotation: number;
}

export interface Particle {
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

export interface ScreenEffect {
  type: 'shake' | 'flash' | 'slowmo' | 'zoom';
  intensity: number;
  duration: number;
  startTime: number;
}

export interface GameState {
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

export const BUG_CONFIG: Record<BugType, { emoji: string; color: string; glow: string; points: number; health: number; size: number }> = {
  bug: { emoji: '🐛', color: '#10b981', glow: '#10b98180', points: 10, health: 1, size: 32 },
  error: { emoji: '❌', color: '#ef4444', glow: '#ef444480', points: 25, health: 2, size: 36 },
  warning: { emoji: '⚠️', color: '#f59e0b', glow: '#f59e0b80', points: 15, health: 1, size: 34 },
  crash: { emoji: '💀', color: '#8b5cf6', glow: '#8b5cf680', points: 50, health: 3, size: 40 },
  boss: { emoji: '👾', color: '#ec4899', glow: '#ec489980', points: 500, health: 20, size: 72 },
};

export const POWERUP_CONFIG: Record<PowerUpType, { emoji: string; color: string; glow: string; effect: string; duration: number }> = {
  coffee: { emoji: '☕', color: '#d97706', glow: '#d9770680', effect: 'Slow Motion', duration: 8000 },
  commit: { emoji: '💾', color: '#06d6a0', glow: '#06d6a080', effect: '3x Score', duration: 10000 },
  deploy: { emoji: '🚀', color: '#3b82f6', glow: '#3b82f680', effect: 'Nuke All', duration: 0 },
  debug: { emoji: '🔍', color: '#a855f7', glow: '#a855f780', effect: 'Auto-Kill', duration: 6000 },
  refactor: { emoji: '♻️', color: '#14b8a6', glow: '#14b8a680', effect: 'Extra Life', duration: 0 },
};

export const BUG_TYPES: BugType[] = ['bug', 'error', 'warning', 'crash'];
export const POWERUP_TYPES: PowerUpType[] = ['coffee', 'commit', 'deploy', 'debug', 'refactor'];

export const easeOutElastic = (t: number): number => {
  if (t === 0 || t === 1) return t;
  return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
};

export const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

