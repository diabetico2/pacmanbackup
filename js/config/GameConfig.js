// Configurações do jogo Pacman
export const GAME_CONFIG = {
  width: 464,
  height: 560,
  backgroundColor: "#000000",
  blockSize: 16,
  speed: 120, // Reduzido de 170 para 120
  ghostSpeedMultiplier: 0.8, // Aumentado ligeiramente de 0.7 para 0.8 para manter desafio
  scaredGhostSpeedMultiplier: 0.6, // Aumentado de 0.5 para 0.6
  
  // Durações dos modos (em milissegundos)
  scatterModeDuration: 7000,
  chaseModeDuration: 20000,
  scaredModeDuration: 9000,
  entryDelay: 7000,
  respawnDelay: 5000,
  
  // Alvos de dispersão dos fantasmas
  scatterTargets: {
    PINKY: { x: 432, y: 80 },
    BLINKY: { x: 32, y: 80 },
    INKY: { x: 432, y: 528 },
    CLYDE: { x: 32, y: 528 }
  },
    // Pontuações
  scores: {
    dot: 10,
    powerPill: 50,
    ghost: 200
  },
    // Configurações de dificuldade por nível
  difficulty: {
    ghostSpeedIncreasePerLevel: 5, // Reduzido de 8 para 5
    scaredModeReductionPerLevel: 300, // Reduzido de 500 para 300
    minimumScaredModeDuration: 3000,
    maxSpeedIncrease: 30 // Reduzido de 50 para 30
  }
};

// Configuração específica do Phaser
export const PHASER_CONFIG = {
  type: Phaser.AUTO,
  width: 464,
  height: 560,
  parent: "container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};
