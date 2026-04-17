import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (s: number) => void }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const directionRef = useRef(direction);
  
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
    setGameOver(false);
    setIsPaused(false);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };

      // Check walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        let newFood;
        while (true) {
          newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          };
          // Make sure food doesn't spawn on snake
          if (!newSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
        }
        setFood(newFood);
        onScoreChange(newSnake.length - 1);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPaused, food, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (e.key === ' ' && gameOver) {
        resetGame();
        return;
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="relative w-[440px] max-w-full aspect-square border-[2px] border-geo-cyan bg-black/50 shadow-[0_0_30px_rgba(0,243,255,0.1)] overflow-hidden m-auto">
      <div 
        className="w-full h-full grid" 
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` 
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
          const x = idx % GRID_SIZE;
          const y = Math.floor(idx / GRID_SIZE);
          
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((segment, i) => i !== 0 && segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          let cellClass = "";
          if (isSnakeHead) cellClass = "bg-geo-lime";
          else if (isSnakeBody) cellClass = "bg-geo-lime opacity-80 scale-90";
          else if (isFood) cellClass = "bg-geo-magenta shadow-[0_0_10px_#ff00ff]";

          return (
            <div key={idx} className={`w-full h-full p-px flex items-center justify-center`}>
               {cellClass && <div className={`w-full h-full ${cellClass}`} />}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center font-mono z-20">
          <h2 className="text-geo-cyan text-2xl mb-4 text-center tracking-widest drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">SEQUENCE TERMINATED</h2>
          <p className="text-geo-lime mb-6 font-bold text-xl drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">SCORE: {snake.length - 1}</p>
          <button 
            onClick={resetGame}
            className="px-6 py-2 border-2 border-geo-cyan text-geo-cyan hover:bg-geo-cyan hover:text-black transition-all font-bold tracking-wider uppercase text-sm"
          >
            [ REBOOT ]
          </button>
        </div>
      )}
      
      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center font-mono z-20">
          <button 
            onClick={() => setIsPaused(false)}
            className="px-6 py-2 border-2 border-geo-lime text-geo-lime hover:bg-geo-lime hover:text-black transition-all font-bold tracking-wider animate-pulse uppercase text-sm"
          >
            [ INITIALIZE ]
          </button>
          <p className="mt-4 text-geo-dim text-xs tracking-widest uppercase">Use arrows or WASD</p>
        </div>
      )}
    </div>
  );
}
