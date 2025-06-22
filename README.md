# 🎮 Pacman Online

Um jogo Pacman clássico com sistema de ranking mundial! Crie sua conta, jogue e dispute com outros players pelo topo do ranking.

## 🌟 **Features**

- 🎯 **Jogo Pacman clássico** com mecânicas fiéis ao original
- 🏆 **Sistema de ranking mundial** com top players
- 👤 **Sistema de contas** com autenticação por senha
- 📊 **Estatísticas de progresso** (melhor score, nível alcançado)
- 🎮 **Múltiplos níveis** com dificuldade progressiva
- 👻 **IA dos fantasmas** com comportamentos únicos
- 💊 **Power Pills** para comer fantasmas
- 🔄 **Respawn automático** após morte
- 📱 **Responsivo** - funciona em desktop e mobile

## 🚀 **Jogar Online**

### [🎮 CLIQUE AQUI PARA JOGAR](https://seu-usuario.github.io/pacman-online/)

## 🛠 **Tecnologias Utilizadas**

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Game Engine**: Phaser 3
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: GitHub Pages
- **Arquitetura**: Modular ES6 Modules

## 🎯 **Como Jogar**

1. **Digite seu nome** na tela inicial
2. **Crie uma senha** (se for novo player) ou **digite sua senha** (se já existe)
3. **Veja o ranking** atual
4. **Pressione ESPAÇO** para começar a jogar
5. **Use as setas** para mover o Pacman
6. **Coma todos os pontos** para avançar de nível
7. **Coma Power Pills** para tornar os fantasmas vulneráveis
8. **Evite os fantasmas** ou seu progresso será salvo e você voltará ao menu

## 📊 **Sistema de Pontuação**

- 🔹 **Ponto pequeno**: 10 pontos
- 💊 **Power Pill**: 50 pontos  
- 👻 **Fantasma**: 200 pontos
- 🎚️ **Multiplicador de nível**: Score aumenta conforme o nível

## 🔧 **Instalação Local**

1. **Clone o repositório**:
```bash
git clone https://github.com/seu-usuario/pacman-online.git
cd pacman-online
```

2. **Configure o Supabase**:
   - Crie uma conta em [supabase.com](https://supabase.com)
   - Execute o script SQL em `database/setup.sql`
   - Atualize as chaves em `js/services/SimpleSupabaseService.js`

3. **Sirva os arquivos**:
```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js
npx serve

# Opção 3: Live Server (VS Code)
```

4. **Acesse**: http://localhost:8000

## 🌐 **Deploy no GitHub Pages**

O jogo é automaticamente deployado no GitHub Pages. Veja instruções completas em `DEPLOY_GITHUB_PAGES.md`.

## 🎮 **Controles**

- **⬅️ ➡️ ⬆️ ⬇️**: Mover Pacman
- **ESPAÇO**: Confirmar/Reiniciar
- **A-Z, 0-9**: Digitar nome e senha
- **BACKSPACE**: Apagar caracteres
- **ENTER**: Confirmar entrada

## 🏆 **Ranking**

O sistema de ranking é global e em tempo real:
- **Top 5** players são sempre exibidos
- **Sua posição** atual no ranking
- **Melhor score** e **nível alcançado** por player
- **Total de partidas** jogadas

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

⭐ **Curtiu o projeto? Deixe uma star!** ⭐
