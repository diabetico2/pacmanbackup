import { GAME_CONFIG } from './config/GameConfig.js';
import { PacmanEntity } from './entities/PacmanEntity.js';
import { GhostEntity } from './entities/GhostEntity.js';
import { MovementSystem } from './systems/MovementSystem.js';
import { GhostAI } from './systems/GhostAI.js';
import { PathfindingSystem } from './systems/PathfindingSystem.js';
import { InputSystem } from './systems/InputSystem.js';
import { GameManager } from './systems/GameManager.js';
import { AssetLoader } from './utils/AssetLoader.js';

export class PacmanScene extends Phaser.Scene {
  constructor() {
    super();
    this.blockSize = GAME_CONFIG.blockSize;
    this.speed = GAME_CONFIG.speed;
    this.ghostSpeed = this.speed * GAME_CONFIG.ghostSpeedMultiplier;
  }

  preload() {
    AssetLoader.preloadAssets(this);
  }

  create() {
    // Inicializa sistemas
    this.pathfinding = new PathfindingSystem(this);
    this.movement = new MovementSystem(this);
    this.ghostAI = new GhostAI(this);
    this.input = new InputSystem(this);
    this.gameManager = new GameManager(this);

    // Cria o mapa
    this.createMap();
    
    // Cria entidades
    this.createPacman();
    this.createGhosts();
    
    // Cria grupos e popula o tabuleiro
    this.createItemGroups();
    this.populateBoardAndTrackEmptyTiles();
    
    // Detecta interseções e configura pathfinding
    this.pathfinding.detectIntersections();
    this.initializeGhostPaths();
    
    // Configura colisões
    this.setupCollisions();
    
    // Cria UI
    this.gameManager.createUI();
    
    // Inicia timers da IA
    this.ghostAI.initModeTimers();
    
    // Inicia entrada dos fantasmas
    this.startGhostEntries();
  }
  
  createMap() {
    this.map = this.make.tilemap({ key: "map" });
    const tileset = this.map.addTilesetImage("pacman tileset");
    this.layer = this.map.createLayer("Tile Layer 1", [tileset]);
    this.layer.setCollisionByExclusion(-1, true);
  }
  
  createPacman() {
    this.pacman = new PacmanEntity(this, 230, 432);
  }
  
  createGhosts() {
    this.pinkGhost = new GhostEntity(this, 232, 290, "pinkGhost", GAME_CONFIG.scatterTargets.PINKY);
    this.orangeGhost = new GhostEntity(this, 210, 290, "orangeGhost", GAME_CONFIG.scatterTargets.CLYDE);
    this.redGhost = new GhostEntity(this, 232, 290, "redGhost", GAME_CONFIG.scatterTargets.BLINKY);
    this.blueGhost = new GhostEntity(this, 255, 290, "blueGhost", GAME_CONFIG.scatterTargets.INKY);
    
    this.ghosts = [this.pinkGhost, this.redGhost, this.orangeGhost, this.blueGhost];
  }
  
  createItemGroups() {
    this.dots = this.physics.add.group();
    this.powerPills = this.physics.add.group();
  }
  
  setupCollisions() {
    // Colisão Pacman com mapa
    this.physics.add.collider(this.pacman.sprite, this.layer);
    
    // Colisão fantasmas com mapa
    this.ghosts.forEach(ghost => {
      this.physics.add.collider(ghost.sprite, this.layer);
    });
    
    // Colisão Pacman com itens
    this.physics.add.overlap(this.pacman.sprite, this.dots, 
      (pacman, dot) => this.gameManager.eatDot(pacman, dot), null, this);
    this.physics.add.overlap(this.pacman.sprite, this.powerPills, 
      (pacman, powerPill) => this.gameManager.eatPowerPill(pacman, powerPill), null, this);
    
    // Colisão Pacman com fantasmas
    this.ghosts.forEach(ghost => {
      this.physics.add.overlap(this.pacman.sprite, ghost.sprite, 
        (pacman, ghostSprite) => this.gameManager.handlePacmanGhostCollision(pacman, ghost), 
        null, this);
    });
  }
  
  initializeGhostPaths() {
    let startPoint = { x: 232, y: 240 };
    
    this.pinkGhost.setPath(this.pathfinding.aStarAlgorithm(startPoint, GAME_CONFIG.scatterTargets.PINKY));
    this.blueGhost.setPath(this.pathfinding.aStarAlgorithm(startPoint, GAME_CONFIG.scatterTargets.INKY));
    this.orangeGhost.setPath(this.pathfinding.aStarAlgorithm(startPoint, GAME_CONFIG.scatterTargets.CLYDE));
    this.redGhost.setPath(this.pathfinding.aStarAlgorithm(startPoint, GAME_CONFIG.scatterTargets.BLINKY));
  }
  
  startGhostEntries() {
    this.ghosts.forEach((ghost, index) => {
      if (ghost.entryTimer) {
        clearTimeout(ghost.entryTimer);
      }
      ghost.entryTimer = setTimeout(() => {
        ghost.enterMaze(232, 240);
      }, GAME_CONFIG.entryDelay * index);
    });
  }
    populateBoardAndTrackEmptyTiles() {
    let dotsCreated = 0; // Contador de dots criados
    
    this.layer.forEachTile((tile) => {
      if (!this.pathfinding.board[tile.y]) {
        this.pathfinding.board[tile.y] = [];
      }
      this.pathfinding.board[tile.y][tile.x] = tile.index;
      
      // Exclui áreas específicas
      if (
        tile.y < 4 ||
        (tile.y > 11 && tile.y < 23 && tile.x > 6 && tile.x < 21) ||
        (tile.y === 17 && tile.x !== 6 && tile.x !== 21)
      ) return;
      
      let rightTile = this.map.getTileAt(tile.x + 1, tile.y, true, "Tile Layer 1");
      let bottomTile = this.map.getTileAt(tile.x, tile.y + 1, true, "Tile Layer 1");
      let rightBottomTile = this.map.getTileAt(tile.x + 1, tile.y + 1, true, "Tile Layer 1");
      
      if (
        tile.index === -1 &&
        rightTile && rightTile.index === -1 &&
        bottomTile && bottomTile.index === -1 &&
        rightBottomTile && rightBottomTile.index === -1
      ) {
        const x = tile.x * tile.width;
        const y = tile.y * tile.height;
        this.dots.create(x + tile.width, y + tile.height, "dot");
        dotsCreated++;
      }
    });

    // Cria power pills
    this.powerPills.create(32, 144, "powerPill");
    this.powerPills.create(432, 144, "powerPill");
    this.powerPills.create(32, 480, "powerPill");
    this.powerPills.create(432, 480, "powerPill");
      console.log(`Total de dots criados: ${dotsCreated}`);
    console.log(`Dots ativos no grupo: ${this.dots.countActive(true)}`);
    
    // Informa ao GameManager quantos dots foram criados
    this.gameManager.setTotalDots(dotsCreated);
  }
    resetGhosts() {
    this.redGhost.reset(232, 290);
    this.pinkGhost.reset(220, 290);
    this.blueGhost.reset(255, 290);
    this.orangeGhost.reset(210, 290);

    this.ghosts.forEach(ghost => {
      let target = this.ghostAI.getScatterTarget(ghost);
      this.pathfinding.updateGhostPath(ghost, target);
    });
    
    this.startGhostEntries();
    this.ghostAI.resetToInitialState();
  }  update() {
    // Verifica se deve reiniciar o jogo após game over
    if (this.gameManager.isGameOver) {
      this.gameManager.checkRestart();
      return;
    }
    
    if (!this.pacman.isAlive) return;
    
    // Atualiza entrada do usuário
    this.input.handleDirectionInput(this.pacman);
    
    // Atualiza movimento do Pacman
    this.movement.updatePacmanMovement(this.pacman);
    this.movement.handleWorldBounds(this.pacman);
    
    // Atualiza fantasmas que entraram no labirinto
    this.ghosts.forEach(ghost => {
      if (ghost.enteredMaze) {
        this.ghostAI.updateGhostDirection(ghost);
        this.movement.updateGhostMovement(ghost, this.ghostSpeed);
      }
    });
  }
}
