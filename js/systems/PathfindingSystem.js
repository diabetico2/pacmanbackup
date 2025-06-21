import { GAME_CONFIG } from '../config/GameConfig.js';

export class PathfindingSystem {
  constructor(scene) {
    this.scene = scene;
    this.blockSize = GAME_CONFIG.blockSize;
    this.intersections = [];
    this.board = [];
  }
  
  detectIntersections() {
    const directions = [
      { x: -this.blockSize, y: 0, name: "left" },
      { x: this.blockSize, y: 0, name: "right" },
      { x: 0, y: -this.blockSize, name: "up" },
      { x: 0, y: this.blockSize, name: "down" },
    ];
    
    for (let y = 0; y < this.scene.map.heightInPixels; y += this.blockSize) {
      for (let x = 0; x < this.scene.map.widthInPixels; x += this.blockSize) {
        if (x % this.blockSize !== 0 || y % this.blockSize !== 0) continue;
        if (!this.isPointClear(x, y)) continue;
        
        let openPaths = [];
        directions.forEach((dir) => {
          if (this.isPathOpenAroundPoint(x + dir.x, y + dir.y)) {
            openPaths.push(dir.name);
          }
        });
        
        if (openPaths.length > 2 && y > 64 && y < 530) {
          this.intersections.push({ x: x, y: y, openPaths: openPaths });
        } else if (openPaths.length === 2 && y > 64 && y < 530) {
          const [dir1, dir2] = openPaths;
          if (
            ((dir1 === "left" || dir1 === "right") &&
              (dir2 === "up" || dir2 === "down")) ||
            ((dir1 === "up" || dir1 === "down") &&
              (dir2 === "left" || dir2 === "right"))
          ) {
            this.intersections.push({ x: x, y: y, openPaths: openPaths });
          }
        }
      }
    }
  }
  
  isPathOpenAroundPoint(pixelX, pixelY) {
    const corners = [
      { x: pixelX - 1, y: pixelY - 1 },
      { x: pixelX + 1, y: pixelY - 1 },
      { x: pixelX - 1, y: pixelY + 1 },
      { x: pixelX + 1, y: pixelY + 1 },
    ];
    
    return corners.every((corner) => {
      const tileX = Math.floor(corner.x / this.blockSize);
      const tileY = Math.floor(corner.y / this.blockSize);
      if (!this.board[tileY] || this.board[tileY][tileX] !== -1) {
        return false;
      }
      return true;
    });
  }
  
  isPointClear(x, y) {
    const corners = [
      { x: x - 1, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ];
    
    return corners.every((corner) => {
      const tileX = Math.floor(corner.x / this.blockSize);
      const tileY = Math.floor(corner.y / this.blockSize);
      return !this.board[tileY] || this.board[tileY][tileX] === -1;
    });
  }
  
  isInGhostHouse(x, y) {
    return x <= 262 && x >= 208 && y <= 290 && y > 240;
  }
  
  aStarAlgorithm(start, target) {
    const isInGhostHouse = this.isInGhostHouse.bind(this);
    
    function findNearestIntersection(point, intersections) {
      let nearest = null;
      let minDist = Infinity;
      for (const intersection of intersections) {
        if (isInGhostHouse(intersection.x, intersection.y)) {
          continue;
        }
        const dist =
          Math.abs(intersection.x - point.x) +
          Math.abs(intersection.y - point.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = intersection;
        }
      }
      return nearest;
    }
    
    const startIntersection = findNearestIntersection.call(
      this,
      start,
      this.intersections
    );
    target = findNearestIntersection.call(this, target, this.intersections);
    
    if (!startIntersection || !target) {
      return [];
    }
    
    const openList = [];
    const closedList = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    
    openList.push({
      node: startIntersection,
      g: 0,
      f: heuristic(startIntersection, target),
    });
    gScore.set(JSON.stringify(startIntersection), 0);
    
    function heuristic(node, target) {
      return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
    }
    
    while (openList.length > 0) {
      openList.sort((a, b) => a.f - b.f);
      const current = openList.shift().node;
      
      if (current.x === target.x && current.y === target.y) {
        const path = [];
        let currentNode = current;
        while (cameFrom.has(JSON.stringify(currentNode))) {
          path.push(currentNode);
          currentNode = cameFrom.get(JSON.stringify(currentNode));
        }
        path.push(startIntersection);
        return path.reverse();
      }
      
      closedList.add(JSON.stringify(current));
      
      const currentIntersection = this.intersections.find(
        (i) => i.x === current.x && i.y === current.y
      );
      
      if (currentIntersection) {
        for (const direction of currentIntersection.openPaths) {
          const neighbor = this.getNextIntersection(
            current.x,
            current.y,
            direction
          );
          
          if (
            neighbor &&
            !isInGhostHouse(neighbor.x, neighbor.y) &&
            !closedList.has(JSON.stringify(neighbor))
          ) {
            const tentativeGScore = gScore.get(JSON.stringify(current)) + 1;
            
            if (
              !gScore.has(JSON.stringify(neighbor)) ||
              tentativeGScore < gScore.get(JSON.stringify(neighbor))
            ) {
              gScore.set(JSON.stringify(neighbor), tentativeGScore);
              const fScore = tentativeGScore + heuristic(neighbor, target);
              openList.push({ node: neighbor, g: tentativeGScore, f: fScore });
              cameFrom.set(JSON.stringify(neighbor), current);
            }
          }
        }
      }
    }
    
    return [];
  }
  
  getNextIntersection(currentX, currentY, direction) {
    let filteredIntersections;
    const isUp = direction === "up";
    const isDown = direction === "down";
    const isLeft = direction === "left";
    const isRight = direction === "right";
    
    filteredIntersections = this.intersections
      .filter((intersection) => {
        return (
          (isUp && intersection.x === currentX && intersection.y < currentY) ||
          (isDown && intersection.x === currentX && intersection.y > currentY) ||
          (isLeft && intersection.y === currentY && intersection.x < currentX) ||
          (isRight && intersection.y === currentY && intersection.x > currentX)
        );
      })
      .sort((a, b) => {
        if (isUp || isDown) {
          return isUp ? b.y - a.y : a.y - b.y;
        } else {
          return isLeft ? b.x - a.x : a.x - b.x;
        }
      });
    
    return filteredIntersections ? filteredIntersections[0] : null;
  }
  
  getNextIntersectionInNextDirection(currentX, currentY, currentDirection, nextDirection) {
    let filteredIntersections;
    const isUp = currentDirection === "up";
    const isDown = currentDirection === "down";
    const isLeft = currentDirection === "left";
    const isRight = currentDirection === "right";
    
    filteredIntersections = this.intersections
      .filter((intersection) => {
        return (
          ((isUp && intersection.x === currentX && intersection.y <= currentY) ||
            (isDown && intersection.x === currentX && intersection.y >= currentY) ||
            (isLeft && intersection.y === currentY && intersection.x <= currentX) ||
            (isRight && intersection.y === currentY && intersection.x >= currentX)) &&
          this.isIntersectionInDirection(intersection, nextDirection)
        );
      })
      .sort((a, b) => {
        if (isUp || isDown) {
          return isUp ? b.y - a.y : a.y - b.y;
        } else {
          return isLeft ? b.x - a.x : a.x - b.x;
        }
      });
    
    return filteredIntersections ? filteredIntersections[0] : null;
  }
  
  isIntersectionInDirection(intersection, direction) {
    switch (direction) {
      case "up":
        return intersection.openPaths.includes("up");
      case "down":
        return intersection.openPaths.includes("down");
      case "left":
        return intersection.openPaths.includes("left");
      case "right":
        return intersection.openPaths.includes("right");
      default:
        return false;
    }
  }
  
  updateGhostPath(ghost, target) {
    let startPoint = { x: ghost.x, y: ghost.y };
    
    if (this.isInGhostHouse(ghost.x, ghost.y)) {
      startPoint = { x: 232, y: 240 };
    }
    
    ghost.setPath(this.aStarAlgorithm(startPoint, target));
  }
}
