import { POWERUP_CONFIG, type GameState } from './model';
export function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, frame: number, pulse: number) {
  const centerX = width / 2, centerY = height / 2;
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width);
      bgGradient.addColorStop(0, '#1e293b');
      bgGradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(-10, -10, width + 20, height + 20);

      ctx.strokeStyle = `rgba(30, 41, 59, ${0.3 + pulse * 0.2})`;
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


}
export function drawHUD(ctx: CanvasRenderingContext2D, width: number, height: number, frame: number, gameState: GameState, slowMo: number, multiplier: number, autoKill: boolean, flash: number) {
  const centerX = width / 2;
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

      if (slowMo < 1) {
        ctx.fillStyle = POWERUP_CONFIG.coffee.color;
        ctx.fillText('☕ SLOW MOTION', 18, indicatorY);
        indicatorY -= 22;
      }
      if (multiplier > 1) {
        ctx.fillStyle = POWERUP_CONFIG.commit.color;
        ctx.fillText('💾 3X SCORE', 18, indicatorY);
        indicatorY -= 22;
      }
      if (autoKill) {
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

      if (flash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flash})`;
        ctx.fillRect(0, 0, width, height);
      }


}
