import { PHASER_CONFIG } from './js/config/GameConfig.js';
import { LoginScene } from './js/scenes/LoginScene.js';
import { PacmanScene } from './js/PacmanScene.js';

// Configuração do jogo Phaser
const config = {
  ...PHASER_CONFIG,
  scene: [LoginScene, PacmanScene] // Começa com a tela de login
};

// Inicializa o jogo
const game = new Phaser.Game(config);
