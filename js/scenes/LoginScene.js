import { SimpleSupabaseService } from '../services/SimpleSupabaseService.js';

export class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoginScene' });
    this.supabaseService = new SimpleSupabaseService();
    this.playerName = '';
    this.currentScreen = 'name'; // 'name', 'password', 'register', 'leaderboard'
  }  create() {
    // Background
    this.add.rectangle(232, 280, 464, 560, 0x000000);
    
    // Título
    this.add.text(232, 50, 'PACMAN ONLINE', {
      fontSize: '32px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.showNameInput();
  }

  showNameInput() {
    this.clearScreen();
    
    this.add.text(232, 120, 'Digite seu nome:', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Campo de input (simulado)
    this.nameInput = this.add.text(232, 160, '', {
      fontSize: '18px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      backgroundColor: '#333333',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.add.text(232, 200, 'Pressione ENTER para continuar', {
      fontSize: '14px',
      fill: '#cccccc',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Instrução
    this.add.text(232, 240, 'Digite as letras do seu nome usando o teclado', {
      fontSize: '12px',
      fill: '#888888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.setupNameInputKeys();
  }

  setupNameInputKeys() {
    // Remove listeners anteriores
    this.input.keyboard.removeAllKeys();
    
    // Adiciona todas as letras
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let letter of letters) {
      this.input.keyboard.addKey(letter).on('down', () => {
        if (this.playerName.length < 12) {
          this.playerName += letter.toLowerCase();
          this.updateNameDisplay();
        }
      });
    }

    // Backspace para apagar
    this.input.keyboard.addKey('BACKSPACE').on('down', () => {
      if (this.playerName.length > 0) {
        this.playerName = this.playerName.slice(0, -1);
        this.updateNameDisplay();
      }
    });

    // Enter para confirmar
    this.input.keyboard.addKey('ENTER').on('down', () => {
      if (this.playerName.length >= 3) {
        this.checkPlayer();
      }
    });
  }

  updateNameDisplay() {
    this.nameInput.setText(this.playerName + '_');
  }

  async checkPlayer() {
    this.showLoading('Verificando player...');
    
    const existingPlayer = await this.supabaseService.checkPlayerExists(this.playerName);
    
    if (existingPlayer) {
      this.showPasswordInput();
    } else {
      this.showRegisterScreen();
    }
  }

  showPasswordInput() {
    this.clearScreen();
    
    this.add.text(232, 120, `Olá, ${this.playerName}!`, {
      fontSize: '20px',
      fill: '#ffff00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(232, 150, 'Digite sua senha:', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.passwordInput = this.add.text(232, 190, '', {
      fontSize: '18px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      backgroundColor: '#333333',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.password = '';
    this.setupPasswordInputKeys();
  }

  showRegisterScreen() {
    this.clearScreen();
    
    this.add.text(232, 120, `Novo player: ${this.playerName}`, {
      fontSize: '20px',
      fill: '#ffff00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(232, 150, 'Crie uma senha:', {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.passwordInput = this.add.text(232, 190, '', {
      fontSize: '18px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      backgroundColor: '#333333',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.add.text(232, 220, '(mínimo 4 caracteres)', {
      fontSize: '12px',
      fill: '#888888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.password = '';
    this.currentScreen = 'register';
    this.setupPasswordInputKeys();
  }

  setupPasswordInputKeys() {
    this.input.keyboard.removeAllKeys();
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let char of chars) {
      this.input.keyboard.addKey(char).on('down', () => {
        if (this.password.length < 16) {
          this.password += char.toLowerCase();
          this.updatePasswordDisplay();
        }
      });
    }

    this.input.keyboard.addKey('BACKSPACE').on('down', () => {
      if (this.password.length > 0) {
        this.password = this.password.slice(0, -1);
        this.updatePasswordDisplay();
      }
    });

    this.input.keyboard.addKey('ENTER').on('down', () => {
      if (this.password.length >= 4) {
        if (this.currentScreen === 'register') {
          this.registerPlayer();
        } else {
          this.authenticatePlayer();
        }
      }
    });
  }

  updatePasswordDisplay() {
    this.passwordInput.setText('*'.repeat(this.password.length) + '_');
  }

  async registerPlayer() {
    this.showLoading('Criando conta...');
    
    const result = await this.supabaseService.createPlayer(this.playerName, this.password);
    
    if (result.success) {
      this.showLeaderboard();
    } else {
      this.showError(result.message);
    }
  }

  async authenticatePlayer() {
    this.showLoading('Autenticando...');
    
    const result = await this.supabaseService.authenticatePlayer(this.playerName, this.password);
    
    if (result.success) {
      this.showLeaderboard();
    } else {
      this.showError(result.message);
    }
  }

  async showLeaderboard() {
    this.clearScreen();
    
    this.add.text(232, 80, 'RANKING TOP 5', {
      fontSize: '24px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.showLoading('Carregando ranking...');
    
    const leaderboardResult = await this.supabaseService.getLeaderboard();
    const rankResult = await this.supabaseService.getPlayerRank();
    
    this.clearScreen();
    
    this.add.text(232, 80, 'RANKING TOP 5', {
      fontSize: '24px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    if (leaderboardResult.success) {
      const leaderboard = leaderboardResult.leaderboard.slice(0, 5);
      
      let y = 120;
      leaderboard.forEach((player, index) => {
        const isCurrentPlayer = player.name === this.playerName;
        const color = isCurrentPlayer ? '#00ff00' : '#ffffff';
        
        this.add.text(232, y, `${index + 1}. ${player.name} - ${player.best_score} pts (Nível ${player.best_level})`, {
          fontSize: '14px',
          fill: color,
          fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        y += 25;
      });

      // Mostra posição do player atual se não estiver no top 5
      if (rankResult.success && rankResult.rank > 5) {
        y += 10;
        this.add.text(232, y, '...', {
          fontSize: '14px',
          fill: '#888888',
          fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        y += 20;
        const currentPlayer = this.supabaseService.currentPlayer;
        this.add.text(232, y, `${rankResult.rank}. ${currentPlayer.name} - ${currentPlayer.best_score} pts (Nível ${currentPlayer.best_level})`, {
          fontSize: '14px',
          fill: '#00ff00',
          fontFamily: 'Arial'
        }).setOrigin(0.5);
      }
    }

    // Botão para começar o jogo
    this.add.text(232, 450, 'Pressione ESPAÇO para jogar!', {
      fontSize: '18px',
      fill: '#ffff00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Efeito de piscar
    this.tweens.add({
      targets: this.children.list[this.children.list.length - 1],
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    this.input.keyboard.addKey('SPACE').on('down', () => {
      // Passa os dados do player para a cena do jogo
      this.scene.start('PacmanScene', { 
        playerName: this.playerName,
        supabaseService: this.supabaseService
      });
    });
  }

  showLoading(message) {
    this.clearScreen();
    this.add.text(232, 280, message, {
      fontSize: '16px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  showError(message) {
    this.clearScreen();
    this.add.text(232, 280, message, {
      fontSize: '16px',
      fill: '#ff0000',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(232, 320, 'Pressione ESPAÇO para tentar novamente', {
      fontSize: '14px',
      fill: '#cccccc',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.input.keyboard.addKey('SPACE').on('down', () => {
      this.showNameInput();
    });
  }  clearScreen() {
    this.children.removeAll();
    
    // Re-adiciona o título
    this.add.text(232, 50, 'PACMAN ONLINE', {
      fontSize: '32px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
  }
}
