// Serviço de fallback usando localStorage para funcionar offline
export class LocalStorageService {
  constructor() {
    this.currentPlayer = null;
    this.STORAGE_KEY = 'pacman_players';
    this.initializeLocalStorage();
  }

  // Inicializa o localStorage se não existir
  initializeLocalStorage() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  // Obtém todos os players do localStorage
  getAllPlayers() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch (error) {
      console.error('Erro ao carregar players:', error);
      return [];
    }
  }

  // Salva todos os players no localStorage
  saveAllPlayers(players) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(players));
      return true;
    } catch (error) {
      console.error('Erro ao salvar players:', error);
      return false;
    }
  }

  // Função simples de hash para senhas
  simpleHash(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  // Verifica se um player existe
  async checkPlayerExists(playerName) {
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const players = this.getAllPlayers();
      return players.find(player => player.name === playerName) || null;
    } catch (error) {
      console.error('Erro ao verificar player:', error);
      return null;
    }
  }

  // Autentica um player existente
  async authenticatePlayer(playerName, password) {
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const player = await this.checkPlayerExists(playerName);
      if (!player) {
        return { success: false, message: 'Player não encontrado!' };
      }

      const hashedPassword = this.simpleHash(password);
      if (player.password_hash !== hashedPassword) {
        return { success: false, message: 'Senha incorreta!' };
      }

      this.currentPlayer = player;
      return { success: true, player };
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return { success: false, message: 'Erro interno do sistema' };
    }
  }

  // Cria um novo player
  async createPlayer(playerName, password) {
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const players = this.getAllPlayers();
      
      // Verifica se o nome já existe
      if (players.find(p => p.name === playerName)) {
        return { success: false, message: 'Nome já existe!' };
      }

      const hashedPassword = this.simpleHash(password);
      
      const newPlayer = {
        id: Date.now(), // ID simples baseado em timestamp
        name: playerName,
        password_hash: hashedPassword,
        best_score: 0,
        best_level: 1,
        total_games: 0,
        created_at: new Date().toISOString()
      };

      players.push(newPlayer);
      
      if (this.saveAllPlayers(players)) {
        this.currentPlayer = newPlayer;
        return { success: true, player: newPlayer };
      } else {
        return { success: false, message: 'Erro ao salvar player' };
      }
    } catch (error) {
      console.error('Erro ao criar player:', error);
      return { success: false, message: 'Erro ao criar player' };
    }
  }

  // Salva o resultado de uma partida
  async saveGameResult(score, level) {
    if (!this.currentPlayer) {
      return { success: false, message: 'Nenhum player logado' };
    }

    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const players = this.getAllPlayers();
      const playerIndex = players.findIndex(p => p.id === this.currentPlayer.id);
      
      if (playerIndex === -1) {
        return { success: false, message: 'Player não encontrado' };
      }

      // Atualiza os dados do player
      players[playerIndex].total_games += 1;
      
      if (score > players[playerIndex].best_score) {
        players[playerIndex].best_score = score;
      }
      
      if (level > players[playerIndex].best_level) {
        players[playerIndex].best_level = level;
      }

      if (this.saveAllPlayers(players)) {
        this.currentPlayer = players[playerIndex];
        return { success: true, player: this.currentPlayer };
      } else {
        return { success: false, message: 'Erro ao salvar resultado' };
      }
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      return { success: false, message: 'Erro ao salvar resultado' };
    }
  }

  // Busca o ranking top 10
  async getLeaderboard() {
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const players = this.getAllPlayers();
      
      // Ordena por melhor pontuação (decrescente)
      const sortedPlayers = players
        .sort((a, b) => b.best_score - a.best_score)
        .slice(0, 10)
        .map(player => ({
          name: player.name,
          best_score: player.best_score,
          best_level: player.best_level,
          total_games: player.total_games
        }));

      return { success: true, leaderboard: sortedPlayers };
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      return { success: false, message: 'Erro ao carregar ranking' };
    }
  }

  // Busca a posição do player atual no ranking
  async getPlayerRank() {
    if (!this.currentPlayer) {
      return { success: false, message: 'Nenhum player logado' };
    }

    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const players = this.getAllPlayers();
      
      // Ordena por melhor pontuação e encontra a posição
      const sortedPlayers = players.sort((a, b) => b.best_score - a.best_score);
      const rank = sortedPlayers.findIndex(p => p.id === this.currentPlayer.id) + 1;
      
      return { success: true, rank };
    } catch (error) {
      console.error('Erro ao buscar posição:', error);
      return { success: false, message: 'Erro ao buscar posição' };
    }
  }

  // Método para debug - mostra todos os players
  debugShowAllPlayers() {
    console.log('Players salvos:', this.getAllPlayers());
  }

  // Método para limpar todos os dados (para testes)
  clearAllData() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.initializeLocalStorage();
    this.currentPlayer = null;
    console.log('Todos os dados foram limpos!');
  }
}
