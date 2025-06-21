import { GAME_CONFIG } from '../config/GameConfig.js';

export class PacmanEntity {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "pacman");
    this.direction = "null";
    this.previousDirection = "left";
    this.nextIntersection = null;
    this.isAlive = true;
    this.hasRespawned = false;
    
    this.createAnimations();
    this.sprite.play("pacmanAnim");
  }
  
  createAnimations() {
    // Animação normal do Pacman
    this.scene.anims.create({
      key: "pacmanAnim",
      frames: [
        { key: "pacman" },
        { key: "pacman1" },
        { key: "pacman2" },
        { key: "pacman3" },
        { key: "pacman4" },
      ],
      frameRate: 10,
      repeat: -1,
    });
    
    // Animação de morte do Pacman
    this.scene.anims.create({
      key: "pacmanDeath",
      frames: [
        { key: "pacmanDeath1" },
        { key: "pacmanDeath2" },
        { key: "pacmanDeath3" },
      ],
      frameRate: 10,
      repeat: 0,
    });
  }
  
  setDirection(direction) {
    this.previousDirection = this.direction;
    this.direction = direction;
  }
  
  die() {
    if (!this.isAlive) return;
    
    this.sprite.setVelocityY(0);
    this.sprite.setVelocityX(0);
    this.isAlive = false;
    this.sprite.anims.stop();
    this.sprite.play("pacmanDeath");
  }
  
  respawn(x, y) {
    this.sprite.setPosition(x, y);
    this.isAlive = true;
    this.hasRespawned = true;
    this.sprite.play("pacmanAnim");
  }
  
  setVelocity(x, y) {
    this.sprite.setVelocityX(x);
    this.sprite.setVelocityY(y);
  }
  
  setRotation(flipX, flipY, angle) {
    this.sprite.setFlipX(flipX);
    this.sprite.setFlipY(flipY);
    this.sprite.setAngle(angle);
  }
  
  resetPosition(x, y) {
    this.sprite.body.reset(x, y);
  }
  
  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
  get body() { return this.sprite.body; }
}
