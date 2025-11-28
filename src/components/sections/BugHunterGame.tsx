import { useState, useEffect, useCallback, useRef } from 'react';
import { FaBug, FaPlay, FaPause, FaTrophy, FaHeart, FaStar, FaCode } from 'react-icons/fa';

interface Bug {
  id: number;
  x: number;
  y: number;
  type: 'bug' | 'feature' | 'coffee';
  speed: number;
  direction: { x: number; y: number };
}

interface GameStats {
  bugsSquashed: number;
  featuresAdded: number;
  coffeesCollected: number;
  highScore: number;
}

export const BugHunterGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('bugHunterStats');
    return saved ? JSON.parse(saved) : { bugsSquashed: 0, featuresAdded: 0, coffeesCollected: 0, highScore: 0 };
  });
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; type: string } | null>(null);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<number | null>(null);

  const bugTypes = {
    bug: { emoji: '🐛', points: 10, message: 'Bug Squashed!' },
    feature: { emoji: '⭐', points: 25, message: 'Feature Added!' },
    coffee: { emoji: '☕', points: 5, message: '+1 Life!', special: true },
  };

  const spawnBug = useCallback(() => {
    if (!gameAreaRef.current || isPaused) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const padding = 40;
    
    // Determinar tipo baseado em probabilidade
    const rand = Math.random();
    let type: 'bug' | 'feature' | 'coffee';
    if (rand < 0.1 && lives < 3) {
      type = 'coffee'; // 10% chance de café se tiver menos de 3 vidas
    } else if (rand < 0.25) {
      type = 'feature'; // 15% chance de feature
    } else {
      type = 'bug'; // 75% chance de bug
    }

    const newBug: Bug = {
      id: Date.now() + Math.random(),
      x: padding + Math.random() * (rect.width - padding * 2 - 40),
      y: padding + Math.random() * (rect.height - padding * 2 - 40),
      type,
      speed: 0.5 + level * 0.3 + Math.random() * 0.5,
      direction: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
    };

    setBugs(prev => [...prev, newBug]);

    // Bugs desaparecem após um tempo se não forem clicados
    setTimeout(() => {
      setBugs(prev => {
        const bugStillExists = prev.find(b => b.id === newBug.id);
        if (bugStillExists && bugStillExists.type === 'bug') {
          // Bug escapou - perde vida
          setLives(l => Math.max(0, l - 1));
          setCombo(0);
        }
        return prev.filter(b => b.id !== newBug.id);
      });
    }, 4000 - level * 200); // Menos tempo em níveis mais altos
  }, [level, lives, isPaused]);

  const handleBugClick = (bug: Bug, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setClickEffect({ 
      x: rect.left + rect.width / 2, 
      y: rect.top + rect.height / 2, 
      type: bug.type 
    });
    setTimeout(() => setClickEffect(null), 500);

    setBugs(prev => prev.filter(b => b.id !== bug.id));
    
    const basePoints = bugTypes[bug.type].points;
    const comboMultiplier = 1 + combo * 0.1;
    const points = Math.floor(basePoints * comboMultiplier);
    
    setScore(prev => prev + points);
    setCombo(prev => prev + 1);
    setShowCombo(true);
    setTimeout(() => setShowCombo(false), 800);

    // Atualizar stats
    setStats(prev => {
      const updated = { ...prev };
      if (bug.type === 'bug') updated.bugsSquashed++;
      if (bug.type === 'feature') updated.featuresAdded++;
      if (bug.type === 'coffee') {
        updated.coffeesCollected++;
        setLives(l => Math.min(5, l + 1)); // Máximo 5 vidas
      }
      return updated;
    });

    // Level up a cada 100 pontos
    if (score + points >= level * 100) {
      setLevel(prev => prev + 1);
    }
  };

  const moveBugs = useCallback(() => {
    if (!gameAreaRef.current || isPaused) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const padding = 10;

    setBugs(prev => prev.map(bug => {
      let newX = bug.x + bug.direction.x * bug.speed;
      let newY = bug.y + bug.direction.y * bug.speed;
      let newDirection = { ...bug.direction };

      // Bounce off walls
      if (newX < padding || newX > rect.width - 50) {
        newDirection.x *= -1;
        newX = Math.max(padding, Math.min(rect.width - 50, newX));
      }
      if (newY < padding || newY > rect.height - 50) {
        newDirection.y *= -1;
        newY = Math.max(padding, Math.min(rect.height - 50, newY));
      }

      return { ...bug, x: newX, y: newY, direction: newDirection };
    }));
  }, [isPaused]);

  useEffect(() => {
    if (isPlaying && !isPaused && !gameOver) {
      gameLoopRef.current = window.setInterval(moveBugs, 16);
      spawnIntervalRef.current = window.setInterval(spawnBug, Math.max(800, 2000 - level * 150));
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, [isPlaying, isPaused, gameOver, moveBugs, spawnBug, level]);

  useEffect(() => {
    if (lives <= 0 && isPlaying) {
      setGameOver(true);
      setIsPlaying(false);
      
      // Salvar high score
      if (score > stats.highScore) {
        const newStats = { ...stats, highScore: score };
        setStats(newStats);
        localStorage.setItem('bugHunterStats', JSON.stringify(newStats));
      } else {
        localStorage.setItem('bugHunterStats', JSON.stringify(stats));
      }
    }
  }, [lives, isPlaying, score, stats]);

  const startGame = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    setBugs([]);
    setCombo(0);
    setGameOver(false);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-dark-bg dark:via-indigo-950/20 dark:to-dark-bg overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium mb-4">
            <FaBug className="animate-bounce" /> Bug Hunter Game
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Ajude-me a Caçar Bugs! 🎯
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto text-sm">
            Clique nos bugs antes que escapem! Colete ⭐ features para bônus e ☕ café para vidas extras.
          </p>
        </div>

        {/* Game Container */}
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
          
          {/* Game HUD */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {/* Score */}
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span className="text-white font-bold text-lg">{score}</span>
              </div>
              
              {/* Lives */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaHeart 
                    key={i} 
                    className={`text-lg transition-all ${
                      i < lives ? 'text-red-500 scale-100' : 'text-gray-600 scale-75'
                    }`} 
                  />
                ))}
              </div>

              {/* Level */}
              <div className="hidden sm:flex items-center gap-2 bg-accent/20 px-3 py-1 rounded-full">
                <FaCode className="text-accent text-sm" />
                <span className="text-accent font-medium text-sm">Level {level}</span>
              </div>
            </div>

            {/* Combo */}
            <div className={`transition-all duration-300 ${showCombo && combo > 1 ? 'scale-110 opacity-100' : 'scale-100 opacity-70'}`}>
              {combo > 1 && (
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  🔥 {combo}x Combo!
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {isPlaying && !gameOver && (
                <button
                  onClick={togglePause}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                  {isPaused ? <FaPlay /> : <FaPause />}
                </button>
              )}
              <div className="text-gray-400 text-sm hidden md:block">
                <FaTrophy className="inline mr-1 text-yellow-500" />
                Record: {stats.highScore}
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div 
            ref={gameAreaRef}
            className="relative h-[400px] md:h-[450px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 cursor-crosshair overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
              `,
            }}
          >
            {/* Dev Avatar no centro */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="relative">
                <img
                  src="https://github.com/pedrolucas167.png"
                  alt="Pedro Lucas"
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-xl transition-transform duration-300 ${
                    isPlaying && !isPaused ? 'animate-pulse' : ''
                  }`}
                />
                {isPlaying && !isPaused && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                    Debugging...
                  </div>
                )}
              </div>
            </div>

            {/* Bugs */}
            {bugs.map(bug => (
              <button
                key={bug.id}
                onClick={(e) => handleBugClick(bug, e)}
                className={`absolute text-3xl md:text-4xl transition-transform hover:scale-125 active:scale-90 cursor-pointer z-10 ${
                  bug.type === 'bug' ? 'animate-wiggle' : 'animate-float'
                }`}
                style={{
                  left: bug.x,
                  top: bug.y,
                  filter: bug.type === 'feature' ? 'drop-shadow(0 0 8px gold)' : 
                          bug.type === 'coffee' ? 'drop-shadow(0 0 8px #8B4513)' : 'none',
                }}
              >
                {bugTypes[bug.type].emoji}
              </button>
            ))}

            {/* Click Effect */}
            {clickEffect && (
              <div
                className="fixed pointer-events-none z-50 animate-ping"
                style={{ left: clickEffect.x - 20, top: clickEffect.y - 20 }}
              >
                <span className="text-4xl">
                  {clickEffect.type === 'bug' ? '💥' : clickEffect.type === 'feature' ? '✨' : '❤️'}
                </span>
              </div>
            )}

            {/* Start Screen */}
            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🐛</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Bug Hunter</h3>
                  <p className="text-gray-300 mb-6 text-sm max-w-xs">
                    Clique nos bugs para eliminá-los!<br/>
                    Não deixe eles escaparem!
                  </p>
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-gradient-to-r from-accent to-emerald-500 hover:from-accent/90 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-accent/30 transition-all hover:scale-105"
                  >
                    <FaPlay className="inline mr-2" /> Começar!
                  </button>
                </div>
              </div>
            )}

            {/* Pause Screen */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="text-center p-8">
                  <div className="text-5xl mb-4">⏸️</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Pausado</h3>
                  <button
                    onClick={togglePause}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
                  >
                    <FaPlay className="inline mr-2" /> Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="text-center p-8 max-w-sm">
                  <div className="text-5xl mb-4">
                    {score > stats.highScore ? '🏆' : '💀'}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {score > stats.highScore ? 'Novo Recorde!' : 'Game Over!'}
                  </h3>
                  <div className="bg-white/10 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-white text-sm">
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">{score}</div>
                        <div className="text-gray-400">Pontos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">{level}</div>
                        <div className="text-gray-400">Level</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-gradient-to-r from-accent to-emerald-500 hover:from-accent/90 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-accent/30 transition-all hover:scale-105"
                  >
                    🔄 Jogar Novamente
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="bg-gray-50 dark:bg-dark-bg px-6 py-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-lg">🐛</span>
                <span><strong className="text-gray-900 dark:text-white">{stats.bugsSquashed}</strong> bugs eliminados</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-lg">⭐</span>
                <span><strong className="text-gray-900 dark:text-white">{stats.featuresAdded}</strong> features</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <span className="text-lg">☕</span>
                <span><strong className="text-gray-900 dark:text-white">{stats.coffeesCollected}</strong> cafés</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto text-center text-xs">
          <div className="bg-white/50 dark:bg-dark-card/50 rounded-xl p-3">
            <span className="text-2xl">🐛</span>
            <p className="text-gray-600 dark:text-gray-400 mt-1">+10 pts</p>
          </div>
          <div className="bg-white/50 dark:bg-dark-card/50 rounded-xl p-3">
            <span className="text-2xl">⭐</span>
            <p className="text-gray-600 dark:text-gray-400 mt-1">+25 pts</p>
          </div>
          <div className="bg-white/50 dark:bg-dark-card/50 rounded-xl p-3">
            <span className="text-2xl">☕</span>
            <p className="text-gray-600 dark:text-gray-400 mt-1">+1 vida</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BugHunterGame;
