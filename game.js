import { PHASER_CONFIG } from './js/config/GameConfig.js';
import { PacmanScene } from './js/PacmanScene.js';

// Configuração do jogo Phaser
const config = {
  ...PHASER_CONFIG,
  scene: PacmanScene
};

// Inicializa o jogo
const game = new Phaser.Game(config);
