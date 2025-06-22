# Pacman Online - Setup do Supabase

## 1. Configuração do Supabase

### Passo 1: Criar conta e projeto
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

### Passo 2: Configurar a base de dados
1. No painel do Supabase, vá para "SQL Editor"
2. Execute o script SQL que está em `database/setup.sql`
3. Isso criará a tabela `players` com todas as configurações necessárias

### Passo 3: Obter as chaves de API
1. No painel do Supabase, vá para "Settings" > "API"
2. Copie a "URL" do projeto
3. Copie a "anon public" key

### Passo 4: Configurar o código
1. Abra o arquivo `js/services/SupabaseService.js`
2. Substitua as seguintes variáveis:
   ```javascript
   const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
   const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';
   ```

## 2. Estrutura da tabela Players

A tabela `players` contém:
- `id`: Identificador único (auto-incremento)
- `name`: Nome do player (único)
- `password_hash`: Hash da senha (simples)
- `best_score`: Melhor pontuação
- `best_level`: Maior nível alcançado
- `total_games`: Total de partidas jogadas
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

## 3. Funcionalidades Implementadas

### Sistema de Login/Registro
- Tela inicial pede o nome do player
- Se o player existe, pede a senha
- Se não existe, permite criar uma conta nova
- Autenticação simples com hash de senha

### Ranking Online
- Mostra top 5 players
- Mostra a posição do player atual
- Atualiza automaticamente após cada partida

### Salvamento de Progresso
- Salva automaticamente a melhor pontuação
- Salva o maior nível alcançado
- Conta o total de partidas jogadas

## 4. Como Jogar

1. Abra o `index.html` no navegador
2. Digite seu nome de player
3. Se for novo, crie uma senha
4. Se já existe, digite sua senha
5. Veja o ranking atual
6. Pressione ESPAÇO para jogar
7. Ao terminar a partida, seu progresso é salvo automaticamente

## 5. Segurança

⚠️ **Nota**: Este é um sistema simples para demonstração. Para produção, considere:
- Hash de senha mais seguro (bcrypt, etc.)
- Validação de entrada mais rigorosa
- Rate limiting para evitar spam
- Sistema de autenticação mais robusto

## 6. Troubleshooting

### Erro de conexão com Supabase
- Verifique se a URL e a chave estão corretas
- Verifique se o projeto Supabase está ativo
- Verifique a conexão com a internet

### Tabela não encontrada
- Execute o script SQL no Supabase
- Verifique se as políticas RLS estão configuradas

### Player não consegue se registrar
- Verifique se o nome não está duplicado
- Verifique as políticas de INSERT na tabela
