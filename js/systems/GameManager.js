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
    this.spaceKey = null;
    this.totalDotsInLevel = 0; // Contador total de dots no nível
    this.dotsEaten = 0; // Contador de dots comidos
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
    this.totalDotsInLevel = total;
    this.dotsEaten = 0;
    console.log(`Novo nível iniciado com ${total} dots`);
  }
  
  eatDot(pacman, dot) {
    dot.disableBody(true, true);
    this.addScore(GAME_CONFIG.scores.dot);
    this.dotsEaten++;
    
    // Verifica quantos dots restam após um pequeno delay para garantir que a contagem esteja atualizada
    this.scene.time.delayedCall(10, () => {
      const dotsRemaining = this.scene.dots.countActive(true);
      const totalDots = this.scene.dots.children.entries.length;
      
      // Conta manualmente os dots ativos
      let manualCount = 0;
      this.scene.dots.children.entries.forEach(dot => {
        if (dot.active && dot.visible) {
          manualCount++;
        }
      });
      
      console.log(`Dots comidos: ${this.dotsEaten}/${this.totalDotsInLevel}`);
      console.log(`Dots restantes: ${dotsRemaining} de ${totalDots} total (contagem manual: ${manualCount})`);
      
      // Usa múltiplas formas de verificar se o nível acabou
      const allDotsEaten = this.dotsEaten >= this.totalDotsInLevel;
      const noDotsRemaining = dotsRemaining === 0;
      const manualCountZero = manualCount === 0;
      
      // Se qualquer uma das verificações indicar que acabaram os dots, sobe de nível
      if (allDotsEaten || noDotsRemaining || manualCountZero) {
        console.log("Todos os dots consumidos! Subindo de nível...");
        this.levelUp();
      }
    });
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
  }
  levelUp() {
    this.level += 1;
    this.levelText.setText('Nível: ' + this.level);
    
    // Mostra mensagem de level up
    this.showLevelUpMessage();
    
    // Pausa temporariamente o jogo
    this.scene.physics.pause();
    
    // Após 2 segundos, continua o jogo
    this.scene.time.delayedCall(2000, () => {
      this.startNewLevel();
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
      'Pressione ESPAÇO para reiniciar',
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
  }
    // Método para verificar se deve reiniciar o jogo
  checkRestart() {
    if (this.isGameOver) {
      // Cria a tecla espaço apenas se ainda não existe
      if (!this.spaceKey) {
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      }
      
      if (this.spaceKey.isDown) {
        this.restartGame();
      }
    }
  }
    restartGame() {
    // Remove os textos de game over
    if (this.gameOverText) this.gameOverText.destroy();
    if (this.finalScoreText) this.finalScoreText.destroy();
    if (this.restartText) this.restartText.destroy();
    
    // Reset da flag e limpa a tecla
    this.isGameOver = false;
    this.spaceKey = null;
    
    // Reinicia a cena completamente
    this.scene.scene.restart();
  }
  
  handlePacmanGhostCollision(pacman, ghost) {
    // Se o fantasma estiver em modo "scared" e ainda não foi comido
    if (this.scene.ghostAI.currentMode === "scared" && !ghost.hasBeenEaten) {
      this.eatGhost();
      
      // Desativa o fantasma temporariamente
      ghost.setActive(false);
      ghost.setVisible(false);
      this.scene.time.delayedCall(1000, () => {
        this.respawnGhost(ghost);
      });
    } else if (ghost.hasBeenEaten) {
      // Pacman morre
      this.pacmanDies();
    }
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
}
