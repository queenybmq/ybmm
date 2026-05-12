import { useEffect, useRef, useCallback } from 'react';
import { GameEngine } from '../game/engine/GameEngine';
import { InputManager } from '../game/engine/InputManager';
import { GAME_WIDTH, GAME_HEIGHT } from '../game/utils/constants';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const inputManagerRef = useRef<InputManager | null>(null);

  const handleStateChange = useCallback((state: 'menu' | 'countdown' | 'playing' | 'gameover', winner?: number | null) => {
    console.log('Game state changed:', state, winner);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    inputManagerRef.current = new InputManager();
    gameEngineRef.current = new GameEngine(
      canvasRef.current,
      inputManagerRef.current,
      handleStateChange
    );
    gameEngineRef.current.start();

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
      }
      if (inputManagerRef.current) {
        inputManagerRef.current.destroy();
      }
    };
  }, [handleStateChange]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="border-4 border-gray-700 rounded-lg shadow-2xl"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="absolute bottom-[-60px] left-0 right-0 text-center text-gray-400 text-sm">
          <p>P1: WASD移动 | J攻击 | K防御 &nbsp;&nbsp;|&nbsp;&nbsp; P2: 方向键移动 | N攻击 | M防御</p>
          <p className="mt-1">空格: 开始/重开 | R: 重新开始</p>
        </div>
      </div>
    </div>
  );
}
