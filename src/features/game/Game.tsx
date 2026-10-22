import { Button } from '../../components/ui';
import { useGameEngine } from './useGameEngine';
import { useGameLoop } from './useGameLoop';
export function Game() {
  const engine = useGameEngine();
  useGameLoop(engine);
  const { canvasRef, containerRef, dimensions, gameState, handleMouseMove, startGame, handleMouseDown, handleTouchStart } = engine;
  return (
    <section id="game" className="relative py-12 sm:py-14 md:py-18 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="relative z-10 section-container">
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 mb-3 sm:mb-4">
            🎮 Arcade Mode
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            Bug <span className="text-gradient-animated">Hunter</span>
            <span className="text-sm sm:text-lg text-[#64748b] font-normal ml-2">PRO</span>
          </h2>
          <p className="text-[#94a3b8] text-sm sm:text-base px-4 sm:px-0">
            Defenda seu código. Destrua os bugs. Sobreviva.
          </p>
        </div>

        <div ref={containerRef} className="max-w-4xl mx-auto px-2 sm:px-3">
          <div className="glass-card-premium p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl">
            <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-2xl">
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
                    <div className="text-center px-4 sm:px-6 w-full max-w-md mx-auto">
                      <div className="text-5xl sm:text-6xl mb-2 sm:mb-3 animate-bounce">💀</div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">GAME OVER</h3>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center mb-3 sm:mb-4">
                        <div className="bg-white/5 rounded-lg p-2.5 sm:p-4">
                          <div className="text-xl sm:text-2xl font-bold text-[#06d6a0]">{gameState.score.toLocaleString()}</div>
                          <div className="text-xs sm:text-sm text-[#64748b] uppercase">Score</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 sm:p-4">
                          <div className="text-xl sm:text-2xl font-bold text-[#ec4899]">{gameState.maxCombo}x</div>
                          <div className="text-xs sm:text-sm text-[#64748b] uppercase">Max Combo</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 sm:p-4">
                          <div className="text-xl sm:text-2xl font-bold text-[#3b82f6]">{gameState.bugsKilled}</div>
                          <div className="text-xs sm:text-sm text-[#64748b] uppercase">Bugs Fixed</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2.5 sm:p-4">
                          <div className="text-xl sm:text-2xl font-bold text-[#f59e0b]">{gameState.level}</div>
                          <div className="text-xs sm:text-sm text-[#64748b] uppercase">Level</div>
                        </div>
                      </div>
                      <Button onClick={startGame} variant="primary" size="md">
                        🔄 Tentar Novamente
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center px-3 sm:px-4 w-full max-w-lg mx-auto overflow-y-auto max-h-full py-3 sm:py-4">
                      <div className="text-4xl sm:text-5xl mb-1 sm:mb-2">🐛</div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Bug Hunter</h3>
                      <p className="text-[#94a3b8] text-xs sm:text-sm mb-3 sm:mb-4">Defenda seu código contra invasores</p>

                      <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                        <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm text-left">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-lg sm:text-xl">🐛</span>
                            <span className="text-[#94a3b8]">10 pts</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-lg sm:text-xl">⚠️</span>
                            <span className="text-[#94a3b8]">15 pts</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-lg sm:text-xl">❌</span>
                            <span className="text-[#94a3b8]">25 pts</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-lg sm:text-xl">💀</span>
                            <span className="text-[#94a3b8]">50 pts</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 col-span-2 justify-center">
                            <span className="text-lg sm:text-xl">👾</span>
                            <span className="text-[#ec4899] font-semibold">BOSS 500 pts</span>
                          </div>
                        </div>

                        <div className="border-t border-white/10 mt-2 sm:mt-3 pt-2 sm:pt-3">
                          <h5 className="text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2">Power-Ups</h5>
                          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-base sm:text-lg">☕</span>
                              <span className="text-[#d97706]">Slow</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-base sm:text-lg">💾</span>
                              <span className="text-[#06d6a0]">3x</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-base sm:text-lg">🚀</span>
                              <span className="text-[#3b82f6]">Nuke</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-base sm:text-lg">🔍</span>
                              <span className="text-[#a855f7]">Auto</span>
                            </div>
                            <div className="flex items-center gap-1 col-span-2">
                              <span className="text-base sm:text-lg">♻️</span>
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
              <div className="mt-2 sm:mt-3 flex flex-wrap justify-between items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-[#94a3b8]">
                  <span>🎯 {gameState.bugsKilled}</span>
                  <span>🔥 {gameState.maxCombo}x</span>
                </div>
                <div className="text-xs sm:text-sm text-[#94a3b8]">
                  Próximo: {Math.max(0, gameState.level * 12 - gameState.bugsKilled)} bugs
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game;
