export class InputSystem {
  constructor(scene) {
    this.scene = scene;
    this.cursors = scene.input.keyboard.createCursorKeys();
  }
  
  handleDirectionInput(pacman) {
    const arrowKeys = ["left", "right", "up", "down"];
    
    for (const key of arrowKeys) {
      if ((this.cursors[key].isDown && pacman.direction !== key) || pacman.hasRespawned) {
        if (pacman.hasRespawned) {
          pacman.hasRespawned = false;
        }
        
        pacman.setDirection(key);
        
        // Define a próxima interseção com base na nova direção
        pacman.nextIntersection = this.scene.pathfinding.getNextIntersectionInNextDirection(
          pacman.x,
          pacman.y,
          pacman.previousDirection,
          key
        );
        break;
      }
    }
  }
}
