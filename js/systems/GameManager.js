import { GAME_CONFIG } from '../config/GameConfig.js';

export class GameManager {  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.scoreText = null;
    this.levelText = null;
    this.lifeCounters = [];
    this.isGameOver = false;
    this.spaceCursor = null;
    this.totalDotsInLevel = 0; // Contador total de dots no nível
    this.dotsEaten = 0; // Contador de dots comidos
    this.isLevelingUp = false; // Flag para prevenir múltiplos level ups
    this.browserKeyListener = null; // Referência para o listener do navegador
  }
  createUI() {
    // Cria contadores de vida dinamicamente
    this.updateLifeCounters();
      // Textos de pontuação e nível
    this.scoreText = this.scene.add.text(16, 60, 'Pontos: ' + this.score, {
      fontSize: '16px',
      fill: '#fff'
    });
    this.levelText = this.scene.add.text(350, 16, 'Nível: ' + this.level, {
      fontSize: '16px',
      fill: '#fff'
    });
    
    // Adiciona texto de instrução no início
    if (this.level === 1) {      this.instructionText = this.scene.add.text(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY + 100,
        'Use as setas para mover\nComa todos os pontos para avançar!',
        {
          fontSize: '14px',
          fill: '#ffff00',
          fontFamily: 'Arial',
          align: 'center'
        }
      ).setOrigin(0.5);
      
      // Remove as instruções após 5 segundos
      this.scene.time.delayedCall(5000, () => {
        if (this.instructionText) {
          this.instructionText.destroy();
        }
      });
    }
  }
  
  updateLifeCounters() {
    // Remove contadores existentes
    if (this.lifeCounters) {
      this.lifeCounters.forEach(counter => {
        if (counter && counter.active) {
          counter.destroy();
        }
      });
    }
    
    // Cria novos contadores baseado nas vidas atuais
    this.lifeCounters = [];
    for (let i = 0; i < this.lives; i++) {
      const x = 32 + (i * 24);
      const lifeCounter = this.scene.add.image(x, 32, "lifeCounter1");
      this.lifeCounters.push(lifeCounter);
    }
  }
    addScore(points) {
    this.score += points;
    this.scoreText.setText('Pontos: ' + this.score);
  }  // Método para definir o total de dots no nível
  setTotalDots(total) {
    // Força o valor correto baseado no que observamos no jogo
    this.totalDotsInLevel = 246; // Número real de dots que existem no mapa
    this.dotsEaten = 0;
    this.isLevelingUp = false;
    console.log(`Novo nível iniciado com ${this.totalDotsInLevel} dots (ajustado para valor correto)`);
  }  // Método para verificar se todos os dots foram consumidos
  checkAllDotsConsumed() {
    const currentActiveDots = this.scene.dots.countActive(true);
    
    // Duas condições para subir de nível:
    // 1. Não há mais dots ativos no grupo
    // 2. OU comeu 246 dots (total real)
    const noDotsLeft = currentActiveDots === 0;
    const ateAllDots = this.dotsEaten >= 246;
    
    const shouldLevelUp = noDotsLeft || ateAllDots;
    
    console.log(`Verificação de dots - Comidos: ${this.dotsEaten}/246, Grupo ativo: ${currentActiveDots}, Level up: ${shouldLevelUp}`);
    
    return shouldLevelUp;
  }
  eatDot(pacman, dot) {
    dot.disableBody(true, true);
    dot.setVisible(false);
    dot.setActive(false);
    this.addScore(GAME_CONFIG.scores.dot);
    this.dotsEaten++;
    
    console.log(`Dot comido! ${this.dotsEaten}/${this.totalDotsInLevel} | Grupo ativo: ${this.scene.dots.countActive(true)}`);
    
    // Verifica imediatamente se todos os dots foram consumidos
    if (this.checkAllDotsConsumed()) {
      console.log("Todos os dots consumidos! Subindo de nível...");
      this.levelUp();    }
  }

  eatPowerPill(pacman, powerPill) {
    powerPill.disableBody(true, true);
    this.addScore(GAME_CONFIG.scores.powerPill);
    
    // Ativa modo scared nos fantasmas
    this.scene.ghostAI.setScaredMode();
    this.scene.ghostSpeed = this.scene.speed * GAME_CONFIG.scaredGhostSpeedMultiplier;
  }
  
  eatGhost() {
    this.addScore(GAME_CONFIG.scores.ghost);
  }  levelUp() {
    // Previne múltiplas chamadas do levelUp
    if (this.isLevelingUp) {
      return;
    }
    this.isLevelingUp = true;
    
    this.level += 1;
    this.levelText.setText('Nível: ' + this.level);
    
    // Mostra mensagem de level up
    this.showLevelUpMessage();
    
    // Pausa temporariamente o jogo
    this.scene.physics.pause();
    
    // Após 2 segundos, continua o jogo
    this.scene.time.delayedCall(2000, () => {
      this.startNewLevel();
      this.isLevelingUp = false;
    });
  }
    showLevelUpMessage() {
    // Cria texto de level up
    this.levelUpText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY - 50,
      `NÍVEL ${this.level}!`,
      {
        fontSize: '32px',
        fill: '#ffff00',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);
    
    // Adiciona efeito de piscar
    this.scene.tweens.add({
      targets: this.levelUpText,
      alpha: 0,
      duration: 300,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.levelUpText.destroy();
      }
    });
  }
    startNewLevel() {
    // Aumenta a dificuldade progressivamente usando as configurações
    const speedIncrease = Math.min(
      (this.level - 1) * GAME_CONFIG.difficulty.ghostSpeedIncreasePerLevel,
      GAME_CONFIG.difficulty.maxSpeedIncrease
    );
    this.scene.ghostSpeed = this.scene.speed * GAME_CONFIG.ghostSpeedMultiplier + speedIncrease;
    
    // Reduz a duração do modo scared conforme o nível aumenta
    const scaredReduction = Math.min(
      (this.level - 1) * GAME_CONFIG.difficulty.scaredModeReductionPerLevel, 
      GAME_CONFIG.scaredModeDuration - GAME_CONFIG.difficulty.minimumScaredModeDuration
    );
    this.scene.ghostAI.scaredModeDuration = Math.max(
      GAME_CONFIG.scaredModeDuration - scaredReduction, 
      GAME_CONFIG.difficulty.minimumScaredModeDuration
    );
      // Limpa todos os itens atuais
    this.scene.dots.clear(true, true);
    this.scene.powerPills.clear(true, true);
    
    // Repopula o tabuleiro
    this.scene.populateBoardAndTrackEmptyTiles();
    
    // Reseta posições do Pacman e fantasmas
    this.scene.pacman.sprite.setPosition(230, 432);
    this.scene.pacman.setDirection("null");
    this.scene.pacman.previousDirection = "left";
    this.scene.pacman.nextIntersection = null;
    this.scene.pacman.setVelocity(0, 0);
    
    // Reinicia os fantasmas
    this.scene.resetGhosts();
    
    // Retoma a física
    this.scene.physics.resume();
    
    console.log(`Nível ${this.level} iniciado! Velocidade dos fantasmas: ${this.scene.ghostSpeed}, Duração scared mode: ${this.scene.ghostAI.scaredModeDuration}ms`);
  }
    loseLife() {
    this.lives -= 1;
    
    // Atualiza os contadores de vida visualmente
    this.updateLifeCounters();
    
    return this.lives > 0;
  }  gameOver() {
    // Destrói todos os sprites principais
    this.scene.pacman.sprite.destroy();
    this.scene.redGhost.sprite.destroy();
    this.scene.pinkGhost.sprite.destroy();
    this.scene.blueGhost.sprite.destroy();
    this.scene.orangeGhost.sprite.destroy();
    
    // Pausa a física
    this.scene.physics.pause();
    
    // Mostra texto de game over
    this.gameOverText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY - 30,
      'FIM DE JOGO',
      {
        fontSize: '32px',
        fill: '#ff0000',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5);
    
    // Mostra pontuação final
    this.finalScoreText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY + 20,
      `Pontuação Final: ${this.score}`,
      {
        fontSize: '20px',
        fill: '#ffff00',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5);
    
    // Mostra instruções para reiniciar
    this.restartText = this.scene.add.text(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY + 60,
      'Reinicie a pagina para começar novamente',
      {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Arial'
      }
    ).setOrigin(0.5);
    
    // Adiciona efeito de piscar no texto de restart
    this.scene.tweens.add({
      targets: this.restartText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
      // Flag para indicar que está em game over
    this.isGameOver = true;
    
    console.log("Game Over ativado. Pressione ESPAÇO para reiniciar.");
    
    // Configura listener de teclado usando eventos do navegador
    this.setupBrowserKeyListener();
  }
  
  setupBrowserKeyListener() {
    // Remove listener anterior se existir
    if (this.browserKeyListener) {
      document.removeEventListener('keydown', this.browserKeyListener);
    }
    
    // Cria novo listener que funciona diretamente com o navegador
    this.browserKeyListener = (event) => {      if (this.isGameOver && event.code === 'Space') {
        event.preventDefault();
        this.restartGame();
      }
    };
      document.addEventListener('keydown', this.browserKeyListener);
  }
    // Método para verificar se deve reiniciar o jogo (agora simplificado)
  checkRestart() {
    // Este método não é mais necessário pois o restart é feito via listener do navegador
  }restartGame() {
    console.log("Reiniciando o jogo...");
    
    // Executa limpeza de recursos
    this.cleanup();
    
    // Remove os textos de game over
    if (this.gameOverText) this.gameOverText.destroy();
    if (this.finalScoreText) this.finalScoreText.destroy();
    if (this.restartText) this.restartText.destroy();
    
    // Reset das flags
    this.isGameOver = false;
    this.isLevelingUp = false;
    this.spaceCursor = null;
    
    // Reinicia a cena completamente
    this.scene.scene.restart();
  }
    handlePacmanGhostCollision(pacman, ghost) {
    // Se o fantasma estiver em modo "scared" e pode ser comido
    if (this.scene.ghostAI.currentMode === "scared" && ghost.enteredMaze && !ghost.hasBeenEaten) {
      this.eatGhost();
      
      // Marca o fantasma como comido
      ghost.hasBeenEaten = true;
      
      // Desativa o fantasma temporariamente
      ghost.setActive(false);
      ghost.setVisible(false);
      this.scene.time.delayedCall(1000, () => {
        this.respawnGhost(ghost);
      });
    } else if (this.scene.ghostAI.currentMode !== "scared" || !ghost.enteredMaze) {
      // Pacman morre apenas se:
      // 1. O fantasma NÃO está em modo scared OU
      // 2. O fantasma ainda não entrou no labirinto
      this.pacmanDies();
    }
    // Se o fantasma está em scared mode mas já foi comido, não faz nada
  }
  
  pacmanDies() {
    if (!this.scene.pacman.isAlive) return;
    
    this.scene.pacman.die();
    this.scene.time.delayedCall(2000, () => {
      this.resetAfterDeath();
    });
  }
  resetAfterDeath() {
    const hasLives = this.loseLife();
    
    if (hasLives) {
      // Pausa temporariamente
      this.scene.physics.pause();
      
      // Após 1.5 segundos, respawn (sem mensagem de vidas)
      this.scene.time.delayedCall(1500, () => {
        this.respawnPacman();
      });
    } else {
      // Game Over
      this.gameOver();
    }
  }
  
  respawnPacman() {
    // Respawn do Pacman na posição inicial
    this.scene.pacman.respawn(230, 432);
    this.scene.pacman.setDirection("null");
    this.scene.pacman.previousDirection = "left";
    this.scene.pacman.nextIntersection = null;
    this.scene.pacman.setVelocity(0, 0);
    
    // Reinicia os fantasmas
    this.scene.resetGhosts();
    
    // Retoma a física
    this.scene.physics.resume();
    
    console.log(`Pacman reviveu! Vidas restantes: ${this.lives}`);
  }
  
  respawnGhost(ghost) {
    ghost.setPosition(232, 290);
    ghost.setActive(true);
    ghost.setVisible(true);
    ghost.setTexture(ghost.originalTexture);
    ghost.hasBeenEaten = true;
    ghost.enterMaze(232, 240);
    
    let target = this.scene.ghostAI.currentMode === "chase" 
      ? this.scene.ghostAI.getChaseTarget(ghost) 
      : this.scene.ghostAI.getScatterTarget(ghost);
    this.scene.pathfinding.updateGhostPath(ghost, target);
  }
    // Método para limpeza de recursos e listeners
  cleanup() {
    // Remove listener do navegador se existir
    if (this.browserKeyListener) {
      document.removeEventListener('keydown', this.browserKeyListener);
      this.browserKeyListener = null;
    }
    
    // Limpa outros recursos se necessário
    this.isGameOver = false;
    this.isLevelingUp = false;
  }
}
