// Serviço alternativo usando apenas Fetch API para evitar problemas de CDN
export class SimpleSupabaseService {
  constructor() {
    this.supabaseUrl = 'https://mvrheemfgobtmbbnjhbi.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cmhlZW1mZ29idG1iYm5qaGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTY1NDIsImV4cCI6MjA2NDU3MjU0Mn0.BI9rJHLULT1j3MLEGztS9ilRXsfJuPH3li_ZnYunQY0';
    this.currentPlayer = null;
  }

  // Headers padrão para as requisições
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.supabaseKey,
      'Authorization': `Bearer ${this.supabaseKey}`,
      'Prefer': 'return=representation'
    };
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
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/players?name=eq.${encodeURIComponent(playerName)}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Erro ao verificar player:', error);
      return null;
    }
  }

  // Autentica um player existente
  async authenticatePlayer(playerName, password) {
    try {
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
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  // Cria um novo player
  async createPlayer(playerName, password) {
    try {
      const hashedPassword = this.simpleHash(password);
      
      const playerData = {
        name: playerName,
        password_hash: hashedPassword,
        best_score: 0,
        best_level: 1,
        total_games: 0
      };

      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/players`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(playerData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.currentPlayer = data[0];
      return { success: true, player: this.currentPlayer };
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
      const updates = {
        total_games: this.currentPlayer.total_games + 1
      };

      if (score > this.currentPlayer.best_score) {
        updates.best_score = score;
      }
      
      if (level > this.currentPlayer.best_level) {
        updates.best_level = level;
      }

      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/players?id=eq.${this.currentPlayer.id}`,
        {
          method: 'PATCH',
          headers: this.getHeaders(),
          body: JSON.stringify(updates)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.currentPlayer = { ...this.currentPlayer, ...updates };
      return { success: true, player: this.currentPlayer };
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      return { success: false, message: 'Erro ao salvar resultado' };
    }
  }

  // Busca o ranking top 10
  async getLeaderboard() {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/players?select=name,best_score,best_level,total_games&order=best_score.desc&limit=10`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, leaderboard: data };
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
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/players?select=name,best_score&best_score=gt.${this.currentPlayer.best_score}`,
        {
          method: 'GET',
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rank = data.length + 1;
      return { success: true, rank };
    } catch (error) {
      console.error('Erro ao buscar posição:', error);
      return { success: false, message: 'Erro ao buscar posição' };
    }
  }
}
