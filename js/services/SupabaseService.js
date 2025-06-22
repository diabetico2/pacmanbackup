// Configuração do Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';

// Configurações do Supabase (você precisa substituir pelos seus valores reais)
const SUPABASE_URL = 'https://mvrheemfgobtmbbnjhbi.supabase.co';
const SUPABASE_ANON_KEY = 'LvG8AWaIPg117vsz53sd3XqorvysLIpzp0Rk9hqxDeW0rMa24ykTdE5bDbmsW+8PO3IXXq7fPJAJikeIBmD6uw==';

// Cria cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export class SupabaseService {
  constructor() {
    this.currentPlayer = null;
  }

  // Verifica se um player existe no banco
  async checkPlayerExists(playerName) {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('id, name, password_hash')
        .eq('name', playerName)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao verificar player:', error);
      return null;
    }
  }

  // Função simples de hash para senhas (em produção use algo mais seguro)
  simpleHash(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
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
      
      const { data, error } = await supabase
        .from('players')
        .insert([
          {
            name: playerName,
            password_hash: hashedPassword,
            best_score: 0,
            best_level: 1,
            total_games: 0
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      this.currentPlayer = data;
      return { success: true, player: data };
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
      // Atualiza o melhor score e nível se necessário
      const updates = {
        total_games: this.currentPlayer.total_games + 1
      };

      if (score > this.currentPlayer.best_score) {
        updates.best_score = score;
      }
      
      if (level > this.currentPlayer.best_level) {
        updates.best_level = level;
      }

      const { data, error } = await supabase
        .from('players')
        .update(updates)
        .eq('id', this.currentPlayer.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      this.currentPlayer = data;
      return { success: true, player: data };
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      return { success: false, message: 'Erro ao salvar resultado' };
    }
  }

  // Busca o ranking top 10
  async getLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('name, best_score, best_level, total_games')
        .order('best_score', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

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
      const { data, error } = await supabase
        .from('players')
        .select('name, best_score')
        .gt('best_score', this.currentPlayer.best_score);

      if (error) {
        throw error;
      }

      const rank = data.length + 1;
      return { success: true, rank };
    } catch (error) {
      console.error('Erro ao buscar posição:', error);
      return { success: false, message: 'Erro ao buscar posição' };
    }
  }
}
