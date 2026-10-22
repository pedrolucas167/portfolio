import { useEffect } from 'react';
import type { useGameEngine } from './useGameEngine';
import { BUG_CONFIG, POWERUP_CONFIG, easeOutBack, easeOutElastic } from './model';
import { drawBackground, drawHUD } from './render';
export function useGameLoop(engine: ReturnType<typeof useGameEngine>) {
  const { schedule, canvasRef, gameState, dimensions, frameCountRef, pulseRef, cameraShakeRef, flashRef, effectsRef, lastSpawnRef, spawnBug, spawnPowerUp, comboTimerRef, setGameState, bugsRef, slowMoRef, createExplosion, addEffect, powerUpsRef, particlesRef, createParticles, scoreMultiplierRef, autoKillRef, animationIdRef } = engine;
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

      drawBackground(ctx, width, height, frame, pulseRef.current);

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
          schedule(() => {
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

      drawHUD(ctx, width, height, frame, gameState, slowMoRef.current, scoreMultiplierRef.current, autoKillRef.current, flashRef.current);

      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationIdRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationIdRef.current);
  }, [gameState, dimensions, spawnBug, spawnPowerUp, createParticles, createExplosion, addEffect]);


}
