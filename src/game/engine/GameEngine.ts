import { InputManager } from './InputManager';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_Y,
  COLORS,
  ATTACK_RANGE,
  ATTACK_DAMAGE,
} from '../utils/constants';

type MechaState = 'idle' | 'walk' | 'attack' | 'defend' | 'hit';
type Facing = 'left' | 'right';

interface MechaEntity {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  hp: number;
  maxHp: number;
  facing: Facing;
  state: MechaState;
  isDefending: boolean;
  isOnGround: boolean;
  attackCooldown: number;
  defendTimer: number;
  hitTimer: number;
  animTimer: number;
  isAttacking: boolean;
  attackFrame: number;
  playerId: number;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;
}

class Mecha {
  x: number;
  y: number;
  velocityX: number = 0;
  velocityY: number = 0;
  hp: number = 100;
  maxHp: number = 100;
  facing: Facing = 'right';
  state: MechaState = 'idle';
  isDefending: boolean = false;
  isOnGround: boolean = true;
  attackCooldown: number = 0;
  defendTimer: number = 0;
  hitTimer: number = 0;
  animTimer: number = 0;
  isAttacking: boolean = false;
  attackFrame: number = 0;
  playerId: number;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;

  constructor(playerId: number, x: number) {
    this.playerId = playerId;
    this.x = x;
    this.y = GROUND_Y;
    
    if (playerId === 1) {
      this.primaryColor = COLORS.redMechPrimary;
      this.secondaryColor = COLORS.redMechSecondary;
      this.darkColor = COLORS.redMechDark;
    } else {
      this.primaryColor = COLORS.blueMechPrimary;
      this.secondaryColor = COLORS.blueMechSecondary;
      this.darkColor = COLORS.blueMechDark;
    }
  }

  reset(x: number): void {
    this.x = x;
    this.y = GROUND_Y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.hp = 100;
    this.maxHp = 100;
    this.facing = this.playerId === 1 ? 'right' : 'left';
    this.state = 'idle';
    this.isDefending = false;
    this.isOnGround = true;
    this.attackCooldown = 0;
    this.defendTimer = 0;
    this.hitTimer = 0;
    this.isAttacking = false;
    this.attackFrame = 0;
  }

  handleInput(input: { left: boolean; right: boolean; jump: boolean; attack: boolean; defend: boolean }): void {
    if (this.state === 'hit') return;

    if (input.left) {
      this.velocityX = -5;
      this.facing = 'left';
      if (this.isOnGround) this.state = 'walk';
    } else if (input.right) {
      this.velocityX = 5;
      this.facing = 'right';
      if (this.isOnGround) this.state = 'walk';
    } else {
      this.velocityX = 0;
      if (this.isOnGround && this.state !== 'attack' && this.state !== 'defend') {
        this.state = 'idle';
      }
    }

    if (input.jump && this.isOnGround) {
      this.velocityY = -14;
      this.isOnGround = false;
    }

    if (input.attack && this.attackCooldown <= 0 && !this.isDefending) {
      this.attack();
    }

    if (input.defend && !this.isAttacking) {
      this.defend();
    } else if (!input.defend) {
      this.isDefending = false;
      if (this.state === 'defend') this.state = 'idle';
    }
  }

  attack(): void {
    this.state = 'attack';
    this.isAttacking = true;
    this.attackFrame = 0;
    this.attackCooldown = 1000;
    this.isDefending = false;
  }

  defend(): void {
    if (this.state !== 'attack' && this.state !== 'hit') {
      this.state = 'defend';
      this.isDefending = true;
      this.defendTimer = 500;
    }
  }

  takeDamage(amount: number): void {
    if (this.isDefending) {
      amount = Math.floor(amount * 0.5);
    }
    this.hp = Math.max(0, this.hp - amount);
    this.state = 'hit';
    this.hitTimer = 300;
    this.isAttacking = false;
    this.isDefending = false;
  }

  update(deltaTime: number): void {
    this.velocityY += 0.6;
    this.y += this.velocityY;
    this.x += this.velocityX;

    if (this.y >= GROUND_Y) {
      this.y = GROUND_Y;
      this.velocityY = 0;
      this.isOnGround = true;
    }

    if (this.x < 30) this.x = 30;
    if (this.x > GAME_WIDTH - 30) this.x = GAME_WIDTH - 30;

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }

    if (this.defendTimer > 0) {
      this.defendTimer -= deltaTime;
      if (this.defendTimer <= 0) {
        this.isDefending = false;
        if (this.state === 'defend') this.state = 'idle';
      }
    }

    if (this.hitTimer > 0) {
      this.hitTimer -= deltaTime;
      if (this.hitTimer <= 0) {
        this.state = 'idle';
      }
    }

    if (this.isAttacking) {
      this.attackFrame += deltaTime;
      if (this.attackFrame >= 300) {
        this.isAttacking = false;
        this.attackFrame = 0;
        if (this.state === 'attack') this.state = 'idle';
      }
    }

    this.animTimer += deltaTime;
  }

  checkCollisionWith(other: Mecha): boolean {
    const distance = Math.abs(this.x - other.x);
    return distance < ATTACK_RANGE;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    const floatOffset = this.state === 'idle' ? Math.sin(this.animTimer / 300) * 3 : 0;
    const renderY = this.y + floatOffset;
    
    if (this.state === 'hit' && Math.floor(this.hitTimer / 50) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    if (this.isDefending) {
      ctx.beginPath();
      ctx.arc(this.x, renderY - 40, 50, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = this.secondaryColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.translate(this.x, renderY);
    if (this.facing === 'left') {
      ctx.scale(-1, 1);
    }
    ctx.translate(-this.x, -renderY);

    this.drawBody(ctx, renderY);
    this.drawHead(ctx, renderY);
    this.drawArms(ctx, renderY);
    this.drawLegs(ctx, renderY);

    if (this.isAttacking) {
      this.drawAttackEffect(ctx, renderY);
    }

    ctx.restore();
  }

  private drawBody(ctx: CanvasRenderingContext2D, y: number): void {
    ctx.fillStyle = this.primaryColor;
    ctx.fillRect(this.x - 20, y - 60, 40, 45);
    
    ctx.fillStyle = this.darkColor;
    ctx.fillRect(this.x - 18, y - 58, 8, 40);
    ctx.fillRect(this.x + 10, y - 58, 8, 40);
    
    ctx.fillStyle = this.secondaryColor;
    ctx.fillRect(this.x - 5, y - 55, 10, 6);
    ctx.fillRect(this.x - 5, y - 45, 10, 6);
  }

  private drawHead(ctx: CanvasRenderingContext2D, y: number): void {
    ctx.fillStyle = this.primaryColor;
    ctx.fillRect(this.x - 15, y - 80, 30, 22);
    
    ctx.fillStyle = this.secondaryColor;
    ctx.fillRect(this.x + 5, y - 75, 12, 8);
    ctx.fillRect(this.x - 17, y - 75, 8, 8);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x - 12, y - 73, 4, 4);
  }

  private drawArms(ctx: CanvasRenderingContext2D, y: number): void {
    ctx.fillStyle = this.darkColor;
    if (this.isAttacking && this.attackFrame < 150) {
      ctx.fillRect(this.x + 18, y - 55, 25, 12);
      ctx.fillStyle = this.secondaryColor;
      ctx.fillRect(this.x + 38, y - 55, 8, 12);
    } else {
      ctx.fillRect(this.x + 18, y - 55, 15, 10);
      ctx.fillRect(this.x - 33, y - 55, 15, 10);
    }
    
    ctx.fillStyle = this.primaryColor;
    if (!this.isAttacking || this.attackFrame >= 150) {
      ctx.fillRect(this.x + 18, y - 55, 15, 10);
      ctx.fillRect(this.x - 33, y - 55, 15, 10);
    }
  }

  private drawLegs(ctx: CanvasRenderingContext2D, y: number): void {
    const walkOffset = this.state === 'walk' ? Math.sin(this.animTimer / 100) * 5 : 0;
    
    ctx.fillStyle = this.darkColor;
    ctx.fillRect(this.x - 15, y - 18, 12, 18);
    ctx.fillRect(this.x + 3, y - 18, 12, 18);
    
    ctx.fillStyle = this.primaryColor;
    ctx.fillRect(this.x - 18, y - 5, 18, 5);
    ctx.fillRect(this.x, y - 5, 18, 5);
  }

  private drawAttackEffect(ctx: CanvasRenderingContext2D, y: number): void {
    if (this.attackFrame < 100) {
      ctx.fillStyle = this.secondaryColor;
      for (let i = 0; i < 5; i++) {
        const offsetX = 40 + Math.random() * 20;
        const offsetY = -40 + Math.random() * 20 - 10;
        ctx.fillRect(this.x + offsetX, y + offsetY, 4, 4);
      }
    }
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player1: Mecha;
  player2: Mecha;
  gameState: 'menu' | 'countdown' | 'playing' | 'gameover' = 'menu';
  countdownValue: number = 3;
  countdownTimer: number = 0;
  winner: number | null = null;
  scores: [number, number] = [0, 0];
  lastTime: number = 0;
  inputManager: InputManager;
  particles: Particle[] = [];
  stars: Star[] = [];
  private animationId: number | null = null;
  private onStateChange?: (state: 'menu' | 'countdown' | 'playing' | 'gameover', winner?: number | null) => void;

  constructor(canvas: HTMLCanvasElement, inputManager: InputManager, onStateChange?: (state: 'menu' | 'countdown' | 'playing' | 'gameover', winner?: number | null) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.inputManager = inputManager;
    this.onStateChange = onStateChange;
    
    this.player1 = new Mecha(1, 200);
    this.player2 = new Mecha(2, 600);
    
    this.initStars();
  }

  private initStars(): void {
    for (let i = 0; i < 100; i++) {
      this.stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GROUND_Y,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
      });
    }
  }

  start(): void {
    if (this.animationId) return;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private gameLoop = (): void => {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    this.updateStars(deltaTime);
    this.updateParticles(deltaTime);

    switch (this.gameState) {
      case 'menu':
        this.updateMenu();
        break;
      case 'countdown':
        this.updateCountdown(deltaTime);
        break;
      case 'playing':
        this.updatePlaying(deltaTime);
        break;
      case 'gameover':
        this.updateGameOver();
        break;
    }
  }

  private updateMenu(): void {
    if (this.inputManager.isKeyDown('Space')) {
      this.gameState = 'countdown';
      this.countdownValue = 3;
      this.countdownTimer = 0;
      if (this.onStateChange) this.onStateChange('countdown');
    }
  }

  private updateCountdown(deltaTime: number): void {
    this.countdownTimer += deltaTime;
    if (this.countdownTimer >= 1000) {
      this.countdownTimer = 0;
      this.countdownValue--;
      if (this.countdownValue <= 0) {
        this.gameState = 'playing';
        if (this.onStateChange) this.onStateChange('playing');
      }
    }
  }

  private updatePlaying(deltaTime: number): void {
    const input1 = this.inputManager.getPlayer1Input();
    const input2 = this.inputManager.getPlayer2Input();

    this.player1.handleInput(input1);
    this.player2.handleInput(input2);

    this.player1.update(deltaTime);
    this.player2.update(deltaTime);

    this.checkAttackCollisions();

    if (this.inputManager.isKeyDown('KeyR')) {
      this.resetGame();
    }
  }

  private checkAttackCollisions(): void {
    if (this.player1.isAttacking && this.player1.attackFrame < 100) {
      if (this.player1.checkCollisionWith(this.player2)) {
        this.player2.takeDamage(ATTACK_DAMAGE);
        this.spawnHitParticles(this.player2.x, this.player2.y - 40, COLORS.redMechSecondary);
      }
    }

    if (this.player2.isAttacking && this.player2.attackFrame < 100) {
      if (this.player2.checkCollisionWith(this.player1)) {
        this.player1.takeDamage(ATTACK_DAMAGE);
        this.spawnHitParticles(this.player1.x, this.player1.y - 40, COLORS.blueMechSecondary);
      }
    }

    if (this.player1.hp <= 0) {
      this.endGame(2);
    } else if (this.player2.hp <= 0) {
      this.endGame(1);
    }
  }

  private endGame(winner: number): void {
    this.gameState = 'gameover';
    this.winner = winner;
    this.scores[winner - 1]++;
    if (this.onStateChange) this.onStateChange('gameover', winner);
  }

  private updateGameOver(): void {
    if (this.inputManager.isKeyDown('Space') || this.inputManager.isKeyDown('KeyR')) {
      this.resetGame();
    }
  }

  resetGame(): void {
    this.player1.reset(200);
    this.player2.reset(600);
    this.gameState = 'countdown';
    this.countdownValue = 3;
    this.countdownTimer = 0;
    this.winner = null;
    this.particles = [];
    if (this.onStateChange) this.onStateChange('countdown');
  }

  private updateStars(_deltaTime: number): void {
    for (const star of this.stars) {
      star.x -= star.speed;
      if (star.x < 0) {
        star.x = GAME_WIDTH;
        star.y = Math.random() * GROUND_Y;
      }
    }
  }

  private updateParticles(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= deltaTime;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private spawnHitParticles(x: number, y: number, color: string): void {
    for (let i = 0; i < 10; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 3,
        life: 500,
        maxLife: 500,
        color,
        size: Math.random() * 4 + 2,
      });
    }
  }

  private render(): void {
    this.renderBackground();
    this.renderGround();
    this.renderStars();
    this.renderParticles();

    if (this.gameState !== 'menu') {
      this.player1.render(this.ctx);
      this.player2.render(this.ctx);
    }

    this.renderUI();
  }

  private renderBackground(): void {
    this.ctx.fillStyle = COLORS.background;
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const gradient = this.ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#0f0f1a');
    gradient.addColorStop(1, '#1a1a2e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  private renderStars(): void {
    for (const star of this.stars) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`;
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }

  private renderGround(): void {
    this.ctx.fillStyle = COLORS.ground;
    this.ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

    this.ctx.fillStyle = COLORS.groundLight;
    this.ctx.fillRect(0, GROUND_Y, GAME_WIDTH, 4);

    this.ctx.fillStyle = COLORS.groundDark;
    for (let x = 0; x < GAME_WIDTH; x += 40) {
      this.ctx.fillRect(x, GROUND_Y + 20, 30, 4);
    }
    for (let x = 20; x < GAME_WIDTH; x += 40) {
      this.ctx.fillRect(x, GROUND_Y + 40, 30, 4);
    }
  }

  private renderParticles(): void {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    this.ctx.globalAlpha = 1;
  }

  private renderUI(): void {
    switch (this.gameState) {
      case 'menu':
        this.renderStartScreen();
        break;
      case 'countdown':
        this.renderHUD();
        this.renderCountdown();
        break;
      case 'playing':
        this.renderHUD();
        break;
      case 'gameover':
        this.renderHUD();
        this.renderGameOver();
        break;
    }
  }

  private renderStartScreen(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.ctx.fillStyle = COLORS.uiGold;
    this.ctx.font = 'bold 48px "Courier New", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('MECHA BATTLE', GAME_WIDTH / 2, 180);

    this.ctx.fillStyle = COLORS.uiText;
    this.ctx.font = '20px "Courier New", monospace';
    this.ctx.fillText('像素风机甲对战', GAME_WIDTH / 2, 230);

    this.ctx.fillStyle = COLORS.redMechPrimary;
    this.ctx.font = 'bold 24px "Courier New", monospace';
    this.ctx.fillText('玩家 1: 烈焰', GAME_WIDTH / 2 - 150, 320);
    this.ctx.fillStyle = COLORS.uiText;
    this.ctx.font = '16px "Courier New", monospace';
    this.ctx.fillText('WASD 移动', GAME_WIDTH / 2 - 150, 355);
    this.ctx.fillText('J 攻击  K 防御', GAME_WIDTH / 2 - 150, 380);

    this.ctx.fillStyle = COLORS.blueMechPrimary;
    this.ctx.font = 'bold 24px "Courier New", monospace';
    this.ctx.fillText('玩家 2: 寒霜', GAME_WIDTH / 2 + 150, 320);
    this.ctx.fillStyle = COLORS.uiText;
    this.ctx.font = '16px "Courier New", monospace';
    this.ctx.fillText('方向键 移动', GAME_WIDTH / 2 + 150, 355);
    this.ctx.fillText('N 攻击  M 防御', GAME_WIDTH / 2 + 150, 380);

    const blink = Math.floor(Date.now() / 500) % 2 === 0;
    if (blink) {
      this.ctx.fillStyle = COLORS.uiGold;
      this.ctx.font = 'bold 28px "Courier New", monospace';
      this.ctx.fillText('按 空格键 开始', GAME_WIDTH / 2, 480);
    }
  }

  private renderCountdown(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.ctx.fillStyle = COLORS.uiGold;
    this.ctx.font = 'bold 120px "Courier New", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.countdownValue.toString(), GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);
  }

  private renderHUD(): void {
    this.renderHealthBar(50, 30, this.player1.hp, this.player1.maxHp, COLORS.redMechPrimary, 'P1');
    this.renderHealthBar(GAME_WIDTH - 250, 30, this.player2.hp, this.player2.maxHp, COLORS.blueMechPrimary, 'P2');
    this.renderScore();
  }

  private renderHealthBar(x: number, y: number, hp: number, maxHp: number, color: string, label: string): void {
    const width = 200;
    const height = 24;

    this.ctx.fillStyle = COLORS.healthBarBg;
    this.ctx.fillRect(x - 2, y - 2, width + 4, height + 4);

    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(x, y, width, height);

    const hpWidth = (hp / maxHp) * width;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, hpWidth, height);

    this.ctx.fillStyle = COLORS.uiText;
    this.ctx.font = 'bold 16px "Courier New", monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`${label} HP: ${hp}/${maxHp}`, x, y - 8);

    for (let i = 0; i < width; i += 20) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
      this.ctx.fillRect(x + i, y, 2, height);
    }
  }

  private renderScore(): void {
    this.ctx.fillStyle = COLORS.uiGold;
    this.ctx.font = 'bold 20px "Courier New", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`胜场: ${this.scores[0]} - ${this.scores[1]}`, GAME_WIDTH / 2, 45);
  }

  private renderGameOver(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const winnerColor = this.winner === 1 ? COLORS.redMechPrimary : COLORS.blueMechPrimary;
    const winnerName = this.winner === 1 ? '烈焰' : '寒霜';

    this.ctx.fillStyle = winnerColor;
    this.ctx.font = 'bold 64px "Courier New", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${winnerName} 获胜!`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30);

    this.ctx.fillStyle = COLORS.uiText;
    this.ctx.font = '24px "Courier New", monospace';
    this.ctx.fillText(`总比分: ${this.scores[0]} - ${this.scores[1]}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30);

    const blink = Math.floor(Date.now() / 500) % 2 === 0;
    if (blink) {
      this.ctx.fillStyle = COLORS.uiGold;
      this.ctx.font = 'bold 28px "Courier New", monospace';
      this.ctx.fillText('按 R 或 空格键 重新开始', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100);
    }
  }
}
