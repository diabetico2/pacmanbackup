import { GAME_CONFIG } from '../config/GameConfig.js';

export class GhostEntity {
  constructor(scene, x, y, spriteKey, scatterTarget) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, spriteKey);
    this.originalTexture = spriteKey;
    this.scatterTarget = scatterTarget;
    this.direction = "right";
    this.previousDirection = "right";
    this.nextIntersection = null;
    this.path = [];
    this.enteredMaze = false;
    this.hasBeenEaten = true;
    this.entryTimer = null;
    this.blinkInterval = null;
    this.stuckTimer = 0;
  }
  
  setPath(path) {
    this.path = path;
    if (this.path.length > 0) {
      this.nextIntersection = this.path.shift();
    }
  }
  
  setTexture(texture) {
    this.sprite.setTexture(texture);
  }
  
  setPosition(x, y) {
    this.sprite.setPosition(x, y);
  }
  
  setVelocity(x, y) {
    this.sprite.setVelocityX(x);
    this.sprite.setVelocityY(y);
  }
  
  resetPosition(x, y) {
    this.sprite.body.reset(x, y);
  }
  
  setActive(active) {
    this.sprite.setActive(active);
  }
  
  setVisible(visible) {
    this.sprite.setVisible(visible);
  }
    enterMaze(x, y) {
    this.setPosition(x, y);
    this.enteredMaze = true;
    
    // Se estiver em modo scared quando entrar no labirinto, pode ser comido
    if (this.scene.ghostAI.currentMode === "scared") {
      this.hasBeenEaten = false;
    } else {
      this.hasBeenEaten = true;
    }
  }
  
  reset(x, y) {
    this.setPosition(x, y);
    this.setTexture(this.originalTexture);
    this.hasBeenEaten = true;
    this.enteredMaze = false;
    this.direction = "left";
    this.stuckTimer = 0;
    
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
    }
    
    if (this.entryTimer) {
      clearTimeout(this.entryTimer);
      this.entryTimer = null;
    }
  }
  
  startBlinking(duration) {
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    
    const blinkTime = duration - 2000;
    this.blinkInterval = setTimeout(() => {
      if (this.hasBeenEaten) return;
      
      let blinkOn = true;
      this.blinkInterval = setInterval(() => {
        blinkOn = !blinkOn;
        this.setTexture(blinkOn ? "scaredGhost" : "scaredGhostWhite");
      }, 200);
    }, blinkTime);
  }
  
  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
  get body() { return this.sprite.body; }
  get texture() { return this.sprite.texture; }
}
