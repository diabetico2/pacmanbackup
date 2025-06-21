// Configurações do jogo Pacman
export const GAME_CONFIG = {
  width: 464,
  height: 560,
  backgroundColor: "#000000",
  blockSize: 16,
  speed: 170,
  ghostSpeedMultiplier: 0.7,
  scaredGhostSpeedMultiplier: 0.5,
  
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
    ghostSpeedIncreasePerLevel: 8,
    scaredModeReductionPerLevel: 500,
    minimumScaredModeDuration: 3000,
    maxSpeedIncrease: 50
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
