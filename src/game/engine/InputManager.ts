import { PlayerInput, PLAYER1_KEYS, PLAYER2_KEYS } from '../utils/constants';

export class InputManager {
  private keys: Set<string> = new Set();
  private prevKeys: Set<string> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.code);
    if ([PLAYER1_KEYS.left, PLAYER1_KEYS.right, PLAYER1_KEYS.jump, 
         PLAYER2_KEYS.left, PLAYER2_KEYS.right, PLAYER2_KEYS.jump,
         'Space', 'KeyR'].includes(e.code as any)) {
      e.preventDefault();
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };

  isKeyDown(key: string): boolean {
    return this.keys.has(key);
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key) && !this.prevKeys.has(key);
  }

  getPlayer1Input(): PlayerInput {
    return {
      left: this.keys.has(PLAYER1_KEYS.left),
      right: this.keys.has(PLAYER1_KEYS.right),
      jump: this.keys.has(PLAYER1_KEYS.jump),
      attack: this.isKeyPressed(PLAYER1_KEYS.attack),
      defend: this.keys.has(PLAYER1_KEYS.defend),
    };
  }

  getPlayer2Input(): PlayerInput {
    return {
      left: this.keys.has(PLAYER2_KEYS.left),
      right: this.keys.has(PLAYER2_KEYS.right),
      jump: this.keys.has(PLAYER2_KEYS.jump),
      attack: this.isKeyPressed(PLAYER2_KEYS.attack),
      defend: this.keys.has(PLAYER2_KEYS.defend),
    };
  }

  update(): void {
    this.prevKeys = new Set(this.keys);
  }

  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
    }
  }
}

export type { PlayerInput };
