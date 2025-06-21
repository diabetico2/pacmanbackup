import { GAME_CONFIG } from '../config/GameConfig.js';

export class GhostAI {
  constructor(scene) {
    this.scene = scene;
    this.blockSize = GAME_CONFIG.blockSize;
    this.scatterTargets = GAME_CONFIG.scatterTargets;
    this.currentMode = "scatter";
    this.previousMode = "scatter";
    this.modeTimer = null;
    
    this.scatterModeDuration = GAME_CONFIG.scatterModeDuration;
    this.chaseModeDuration = GAME_CONFIG.chaseModeDuration;
    this.scaredModeDuration = GAME_CONFIG.scaredModeDuration;
  }
    initModeTimers() {
    this.setModeTimer(this.scatterModeDuration);
  }
  
  resetToInitialState() {
    this.currentMode = "scatter";
    this.previousMode = "scatter";
    if (this.modeTimer) {
      clearTimeout(this.modeTimer);
    }
    this.initModeTimers();
  }
  
  setModeTimer(duration) {
    if (this.modeTimer) {
      clearTimeout(this.modeTimer);
    }
    this.modeTimer = setTimeout(() => {
      this.switchMode();
    }, duration);
  }
  
  switchMode() {
    if (this.currentMode === "scared") {
      this.currentMode = this.previousMode || "scatter";
      this.setModeTimer(this[this.currentMode + "ModeDuration"]);
      
      this.scene.ghosts.forEach((ghost) => {
        clearInterval(ghost.blinkInterval);
        ghost.setTexture(ghost.originalTexture);
        
        let target = this.currentMode === "chase" 
          ? this.getChaseTarget(ghost) 
          : this.getScatterTarget(ghost);
        this.scene.pathfinding.updateGhostPath(ghost, target);
        ghost.hasBeenEaten = true;
      });
    } else {
      if (this.currentMode === "scatter") {
        this.currentMode = "chase";
        this.setModeTimer(this.chaseModeDuration);
      } else {
        this.currentMode = "scatter";
        this.setModeTimer(this.scatterModeDuration);
      }
      
      this.scene.ghosts.forEach((ghost) => {
        let target = this.currentMode === "chase" 
          ? this.getChaseTarget(ghost) 
          : this.getScatterTarget(ghost);
        this.scene.pathfinding.updateGhostPath(ghost, target);
      });
      this.previousMode = this.currentMode;
    }
  }
  
  getChaseTarget(ghost) {
    const pacman = this.scene.pacman;
    
    if (ghost.texture.key === "redGhost") {
      // Blinky persegue diretamente o Pacman
      return { x: pacman.x, y: pacman.y };
    }
    
    if (ghost.texture.key === "pinkGhost") {
      // Pinky tenta prever o movimento do Pacman
      const offset = this.blockSize * 4;
      switch (pacman.direction) {
        case "right":
          return { x: pacman.x + offset, y: pacman.y };
        case "left":
          return { x: pacman.x - offset, y: pacman.y };
        case "up":
          return { x: pacman.x, y: pacman.y - offset };
        case "down":
          return { x: pacman.x, y: pacman.y + offset };
        default:
          return { x: pacman.x, y: pacman.y };
      }
    }
    
    if (ghost.texture.key === "orangeGhost") {
      // Clyde persegue o Pacman se estiver longe
      const distance = Math.hypot(ghost.x - pacman.x, ghost.y - pacman.y);
      return distance > this.blockSize * 8 
        ? { x: pacman.x, y: pacman.y } 
        : this.scatterTargets.CLYDE;
    }
    
    if (ghost.texture.key === "blueGhost") {
      // Inky utiliza a posição de Blinky e a posição prevista do Pacman
      const blinky = this.scene.redGhost;
      let pacmanAhead = { x: pacman.x, y: pacman.y };
      const aheadOffset = this.blockSize * 2;
      
      switch (pacman.direction) {
        case "right":
          pacmanAhead = { x: pacman.x + aheadOffset, y: pacman.y };
          break;
        case "left":
          pacmanAhead = { x: pacman.x - aheadOffset, y: pacman.y };
          break;
        case "up":
          pacmanAhead = { x: pacman.x, y: pacman.y - aheadOffset };
          break;
        case "down":
          pacmanAhead = { x: pacman.x, y: pacman.y + aheadOffset };
          break;
      }
      
      const vectorX = pacmanAhead.x - blinky.x;
      const vectorY = pacmanAhead.y - blinky.y;
      return { x: blinky.x + 2 * vectorX, y: blinky.y + 2 * vectorY };
    }
  }
  
  getScaredTarget() {
    const intersections = this.scene.pathfinding.intersections;
    let randomIndex = Math.floor(Math.random() * intersections.length);
    let randomIntersection = intersections[randomIndex];
    return { x: randomIntersection.x, y: randomIntersection.y };
  }
  
  getScatterTarget(ghost) {
    if (ghost.texture.key === "redGhost") return this.scatterTargets.BLINKY;
    if (ghost.texture.key === "pinkGhost") return this.scatterTargets.PINKY;
    if (ghost.texture.key === "orangeGhost") return this.scatterTargets.CLYDE;
    if (ghost.texture.key === "blueGhost") return this.scatterTargets.INKY;
  }
  
  setScaredMode() {
    this.currentMode = "scared";
    this.setModeTimer(this.scaredModeDuration);
    
    this.scene.ghosts.forEach((ghost) => {
      let scaredTarget = this.getScaredTarget();
      this.scene.pathfinding.updateGhostPath(ghost, scaredTarget);
      ghost.startBlinking(this.scaredModeDuration);
      ghost.setTexture("scaredGhost");
      ghost.hasBeenEaten = false;
    });
  }
  
  updateGhostDirection(ghost) {
    // Verifica se o fantasma está na casa dos fantasmas
    if (this.scene.pathfinding.isInGhostHouse(ghost.x, ghost.y)) {
      ghost.setVelocity(0, -this.scene.ghostSpeed);
      if (ghost.direction === "down") ghost.direction = "up";
    }
    
    // Verifica se o fantasma está parado
    const isMoving = ghost.body.velocity.x !== 0 || ghost.body.velocity.y !== 0;
    if (!isMoving) {
      ghost.stuckTimer = (ghost.stuckTimer || 0) + 1;
      if (ghost.stuckTimer > 30) {
        ghost.stuckTimer = 0;
        let newTarget = this.currentMode === "scared" 
          ? this.getScaredTarget() 
          : this.currentMode === "chase" 
            ? this.getChaseTarget(ghost) 
            : this.getScatterTarget(ghost);
        this.scene.pathfinding.updateGhostPath(ghost, newTarget);
      }
    } else {
      ghost.stuckTimer = 0;
    }
    
    // Ajusta posição se parado
    if (ghost.body.velocity.x == 0 && ghost.body.velocity.y == 0) {
      this.adjustGhostPosition(ghost);
    }
    
    // Verifica se chegou na interseção
    let isAtIntersection = this.isGhostAtIntersection(
      ghost.nextIntersection, ghost.x, ghost.y, ghost.direction
    );
    
    if (isAtIntersection) {
      // Verifica se deve parar no alvo de dispersão
      if (this.shouldStopAtScatterTarget(ghost)) return;
      
      // Recalcula caminho se estiver em modo chase
      if (this.currentMode === "chase") {
        let chaseTarget = this.getChaseTarget(ghost);
        this.scene.pathfinding.updateGhostPath(ghost, chaseTarget);
      }
      
      if (ghost.path.length > 0) {
        ghost.nextIntersection = ghost.path.shift();
      }
      
      if (ghost.path.length == 0 && this.currentMode === "scared") {
        let scaredTarget = this.getScaredTarget();
        this.scene.pathfinding.updateGhostPath(ghost, scaredTarget);
      }
      
      // Define nova direção
      let newDirection = this.getGhostNextDirection(ghost, ghost.nextIntersection);
      ghost.previousDirection = ghost.direction;
      ghost.direction = newDirection;
    }
  }
  
  shouldStopAtScatterTarget(ghost) {
    if (this.currentMode !== "scatter") return false;
    
    const target = ghost.nextIntersection;
    if (!target) return false;
    
    if (ghost.texture.key === "pinkGhost" && 
        this.scatterTargets.PINKY.x === target.x && 
        this.scatterTargets.PINKY.y === target.y) return true;
    
    if (ghost.texture.key === "redGhost" && 
        this.scatterTargets.BLINKY.x === target.x && 
        this.scatterTargets.BLINKY.y === target.y) return true;
    
    if (ghost.texture.key === "blueGhost" && 
        this.scatterTargets.INKY.x === target.x && 
        this.scatterTargets.INKY.y === target.y) return true;
    
    if (ghost.texture.key === "orangeGhost" && 
        this.scatterTargets.CLYDE.x === target.x && 
        this.scatterTargets.CLYDE.y === target.y) return true;
    
    return false;
  }
  
  adjustGhostPosition(ghost) {
    if (ghost.x % this.blockSize !== 0) {
      let nearestMultiple = Math.round(ghost.x / this.blockSize) * this.blockSize;
      ghost.resetPosition(nearestMultiple, ghost.y);
    }
    if (ghost.y % this.blockSize !== 0) {
      let nearestMultiple = Math.round(ghost.y / this.blockSize) * this.blockSize;
      ghost.resetPosition(ghost.x, nearestMultiple);
    }
  }
  
  isGhostAtIntersection(intersection, currentX, currentY, direction) {
    if (!intersection) return false;
    
    const isUp = direction === "up";
    const isDown = direction === "down";
    const isLeft = direction === "left";
    const isRight = direction === "right";
    
    return (
      (isUp && intersection.x === currentX && intersection.y >= currentY) ||
      (isDown && intersection.x === currentX && intersection.y <= currentY) ||
      (isLeft && intersection.y === currentY && intersection.x >= currentX) ||
      (isRight && intersection.y === currentY && intersection.x <= currentX)
    );
  }
  
  getGhostNextDirection(ghost, intersection) {
    if (!intersection) return "up";
    
    if (Math.abs(intersection.x - ghost.x) < this.blockSize && ghost.y <= intersection.y)
      return "down";
    if (Math.abs(intersection.x - ghost.x) < this.blockSize && ghost.y >= intersection.y)
      return "up";
    if (Math.abs(intersection.y - ghost.y) < this.blockSize && ghost.x <= intersection.x)
      return "right";
    if (Math.abs(intersection.y - ghost.y) < this.blockSize && ghost.x >= intersection.x)
      return "left";
    
    return "up";
  }
}
