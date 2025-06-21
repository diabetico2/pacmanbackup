import { GAME_CONFIG } from '../config/GameConfig.js';

export class MovementSystem {
  constructor(scene) {
    this.scene = scene;
    this.blockSize = GAME_CONFIG.blockSize;
    this.speed = GAME_CONFIG.speed;
  }
  
  // Movimento do Pacman
  updatePacmanMovement(pacman) {
    let nextIntersectionx = null;
    let nextIntersectiony = null;
    
    if (pacman.nextIntersection) {
      nextIntersectionx = pacman.nextIntersection.x;
      nextIntersectiony = pacman.nextIntersection.y;
    }
    
    switch (pacman.direction) {
      case "left":
        this.handlePacmanMovementInDirection(
          pacman, "left", "right", pacman.y, nextIntersectiony, pacman.x,
          true, false, 0, -this.speed, 0, pacman.body.velocity.y
        );
        break;
      case "right":
        this.handlePacmanMovementInDirection(
          pacman, "right", "left", pacman.y, nextIntersectiony, pacman.x,
          true, false, 180, this.speed, 0, pacman.body.velocity.y
        );
        break;
      case "up":
        this.handlePacmanMovementInDirection(
          pacman, "up", "down", pacman.x, nextIntersectionx, pacman.y,
          false, true, -90, 0, -this.speed, pacman.body.velocity.x
        );
        break;
      case "down":
        this.handlePacmanMovementInDirection(
          pacman, "down", "up", pacman.x, nextIntersectionx, pacman.y,
          false, true, 90, 0, this.speed, pacman.body.velocity.x
        );
        break;
    }
  }
  
  handlePacmanMovementInDirection(pacman, currentDirection, oppositeDirection, 
    pacmanPosition, intersectionPosition, movingCoordinate, flipX, flipY, 
    angle, velocityX, velocityY, currentVelocity) {
    
    let perpendicularDirection = 
      currentDirection === "left" || currentDirection === "right" 
        ? ["up", "down"] : ["left", "right"];
    
    let condition = false;
    if (pacman.nextIntersection) {
      condition = 
        (pacman.previousDirection == perpendicularDirection[0] && 
         pacmanPosition <= intersectionPosition) ||
        (pacman.previousDirection == perpendicularDirection[1] && 
         pacmanPosition >= intersectionPosition) ||
        pacman.previousDirection === oppositeDirection;
    }
    
    if (condition) {
      let newPosition = intersectionPosition;
      if (pacman.previousDirection != oppositeDirection && 
          newPosition !== pacmanPosition) {
        if (currentDirection === "left" || currentDirection === "right") {
          pacman.resetPosition(movingCoordinate, newPosition);
        } else {
          pacman.resetPosition(newPosition, movingCoordinate);
        }
      }
      this.changePacmanDirection(pacman, flipX, flipY, angle, velocityX, velocityY);
      this.adjustPacmanPosition(pacman, velocityX, velocityY);
    } else if (currentVelocity === 0) {
      this.changePacmanDirection(pacman, flipX, flipY, angle, velocityX, velocityY);
      this.adjustPacmanPosition(pacman, velocityX, velocityY);
    }
  }
  
  changePacmanDirection(pacman, flipX, flipY, angle, velocityX, velocityY) {
    pacman.setRotation(flipX, flipY, angle);
    pacman.setVelocity(velocityX, velocityY);
  }
  
  adjustPacmanPosition(pacman, velocityX, velocityY) {
    if (pacman.x % this.blockSize !== 0 && velocityY > 0) {
      let nearestMultiple = Math.round(pacman.x / this.blockSize) * this.blockSize;
      pacman.resetPosition(nearestMultiple, pacman.y);
    }
    if (pacman.y % this.blockSize !== 0 && velocityX > 0) {
      let nearestMultiple = Math.round(pacman.y / this.blockSize) * this.blockSize;
      pacman.resetPosition(pacman.x, nearestMultiple);
    }
  }
  
  // Movimento dos fantasmas
  updateGhostMovement(ghost, ghostSpeed) {
    let nextIntersectionx = null;
    let nextIntersectiony = null;
    
    if (ghost.nextIntersection) {
      nextIntersectionx = ghost.nextIntersection.x;
      nextIntersectiony = ghost.nextIntersection.y;
    }
    
    switch (ghost.direction) {
      case "left":
        this.handleGhostMovementInDirection(
          ghost, "left", "right", ghost.y, nextIntersectiony, ghost.x,
          -ghostSpeed, 0, ghost.body.velocity.y
        );
        break;
      case "right":
        this.handleGhostMovementInDirection(
          ghost, "right", "left", ghost.y, nextIntersectiony, ghost.x,
          ghostSpeed, 0, ghost.body.velocity.y
        );
        break;
      case "up":
        this.handleGhostMovementInDirection(
          ghost, "up", "down", ghost.x, nextIntersectionx, ghost.y,
          0, -ghostSpeed, ghost.body.velocity.x
        );
        break;
      case "down":
        this.handleGhostMovementInDirection(
          ghost, "down", "up", ghost.x, nextIntersectionx, ghost.y,
          0, ghostSpeed, ghost.body.velocity.x
        );
        break;
    }
  }
  
  handleGhostMovementInDirection(ghost, currentDirection, oppositeDirection,
    ghostPosition, intersectionPosition, movingCoordinate, velocityX, velocityY, currentVelocity) {
    
    let perpendicularDirection = 
      currentDirection === "left" || currentDirection === "right" 
        ? ["up", "down"] : ["left", "right"];
    
    let condition = false;
    if (ghost.nextIntersection) {
      condition = 
        (ghost.previousDirection == perpendicularDirection[0] && 
         ghostPosition <= intersectionPosition) ||
        (ghost.previousDirection == perpendicularDirection[1] && 
         ghostPosition >= intersectionPosition) ||
        ghost.previousDirection === oppositeDirection;
    }
    
    if (condition) {
      let newPosition = intersectionPosition;
      if (ghost.previousDirection != oppositeDirection && 
          newPosition !== ghostPosition) {
        if (currentDirection === "left" || currentDirection === "right") {
          ghost.resetPosition(movingCoordinate, newPosition);
        } else {
          ghost.resetPosition(newPosition, movingCoordinate);
        }
      }
      ghost.setVelocity(velocityX, velocityY);
    } else if (currentVelocity === 0) {
      ghost.setVelocity(velocityX, velocityY);
    }
  }
  
  handleWorldBounds(pacman) {
    const worldBounds = this.scene.physics.world.bounds;
    
    if (pacman.x <= worldBounds.x) {
      pacman.resetPosition(worldBounds.right - this.blockSize, pacman.y);
      pacman.nextIntersection = this.scene.pathfinding.getNextIntersectionInNextDirection(
        pacman.x, pacman.y, "left", pacman.direction
      );
      pacman.setVelocity(-this.speed, 0);
    }
    
    if (pacman.x >= worldBounds.right) {
      pacman.resetPosition(worldBounds.x + this.blockSize, pacman.y);
      pacman.nextIntersection = this.scene.pathfinding.getNextIntersectionInNextDirection(
        pacman.x, pacman.y, "right", pacman.direction
      );
      pacman.setVelocity(this.speed, 0);
    }
  }
}
