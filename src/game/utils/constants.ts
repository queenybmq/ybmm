export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const GROUND_Y = 450;
export const GRAVITY = 0.6;
export const MOVE_SPEED = 5;
export const JUMP_FORCE = -14;
export const ATTACK_RANGE = 80;
export const ATTACK_DAMAGE = 10;
export const ATTACK_COOLDOWN = 1000;
export const DEFEND_DURATION = 500;
export const MAX_HP = 100;
export const MECHA_WIDTH = 60;
export const MECHA_HEIGHT = 80;

export const COLORS = {
  background: '#1a1a2e',
  ground: '#4a4a6a',
  groundLight: '#5a5a7a',
  groundDark: '#3a3a5a',
  redMechPrimary: '#e63946',
  redMechSecondary: '#ff6b6b',
  redMechDark: '#a82834',
  blueMechPrimary: '#4361ee',
  blueMechSecondary: '#4cc9f0',
  blueMechDark: '#2a4494',
  uiText: '#f1faee',
  uiGold: '#ffd700',
  healthBarBg: '#2d2d44',
  healthBarRed: '#e63946',
  healthBarBlue: '#4361ee',
};

export type MechaState = 'idle' | 'walk' | 'attack' | 'defend' | 'hit';
export type Facing = 'left' | 'right';
export type GameState = 'menu' | 'countdown' | 'playing' | 'gameover';

export interface Position {
  x: number;
  y: number;
}

export interface PlayerInput {
  left: boolean;
  right: boolean;
  jump: boolean;
  attack: boolean;
  defend: boolean;
}

export const PLAYER1_KEYS = {
  left: 'KeyA',
  right: 'KeyD',
  jump: 'KeyW',
  attack: 'KeyJ',
  defend: 'KeyK',
};

export const PLAYER2_KEYS = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  jump: 'ArrowUp',
  attack: 'KeyN',
  defend: 'KeyM',
};
