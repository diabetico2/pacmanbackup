# Pacman Online - Deploy no GitHub Pages

## ✅ **Seu projeto é compatível!**

O Pacman Online funciona perfeitamente no GitHub Pages porque:
- ✅ É 100% frontend (HTML, CSS, JavaScript)
- ✅ Usa apenas APIs públicas (Supabase)
- ✅ Não precisa de servidor backend
- ✅ Funciona com arquivos estáticos

## 🚀 **Como fazer o deploy:**

### Passo 1: Preparar o repositório
```bash
git init
git add .
git commit -m "Pacman Online - versão inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pacman-online.git
git push -u origin main
```

### Passo 2: Ativar GitHub Pages
1. Vá para seu repositório no GitHub
2. **Settings** > **Pages**
3. **Source**: Deploy from a branch
4. **Branch**: main
5. **Folder**: / (root)
6. Clique em **Save**

### Passo 3: Configurar Supabase para CORS
No painel do Supabase:
1. **Settings** > **API**
2. **CORS Origins** adicione:
   - `https://SEU_USUARIO.github.io`
   - `http://localhost:3000` (para desenvolvimento)

## 🌐 **URL final:**
`https://SEU_USUARIO.github.io/pacman-online/`

## 🔧 **Configurações adicionais:**

### Para domínio customizado (opcional):
1. Compre um domínio
2. Configure DNS CNAME para `SEU_USUARIO.github.io`
3. No GitHub: Settings > Pages > Custom domain

### Para HTTPS obrigatório:
- GitHub Pages força HTTPS automaticamente
- Supabase já suporta HTTPS

## 📁 **Estrutura ideal para GitHub Pages:**
```
seu-repositorio/
├── index.html          (✅ já existe)
├── style.css           (✅ já existe)
├── game.js             (✅ já existe)
├── js/                 (✅ já existe)
├── ghost/              (✅ já existe)
├── pac man & life counter & death/ (✅ já existe)
├── pac man tiles/      (✅ já existe)
├── pacman characters/  (✅ já existe)
├── pacman Items/       (✅ já existe)
├── README.md           (recomendado)
└── .gitignore          (✅ criado)
```

## ⚡ **Otimizações para produção:**

### Cache busting (opcional):
Para forçar atualizações, adicione versões aos arquivos:
```html
<script type="module" src="game.js?v=1.0"></script>
```

### Meta tags para SEO:
Adicione no `<head>` do index.html:
```html
<meta name="description" content="Pacman Online - Jogue o clássico Pacman com ranking mundial!">
<meta property="og:title" content="Pacman Online">
<meta property="og:description" content="Jogue Pacman online com ranking mundial!">
<meta property="og:type" content="website">
```

## 🐛 **Troubleshooting:**

### Erro 404:
- Verifique se o repositório é público
- Confirme que o GitHub Pages está ativado
- Aguarde alguns minutos para propagação

### Erro CORS:
- Adicione a URL do GitHub Pages no Supabase
- Verifique se a chave de API está correta

### Arquivos não carregam:
- Verifique caminhos relativos nos imports
- Confirme que todos os arquivos estão commitados

## 🎮 **Vantagens do GitHub Pages:**
- ✅ **Gratuito** para repositórios públicos
- ✅ **CDN global** - carregamento rápido
- ✅ **HTTPS automático**
- ✅ **Deploy automático** a cada push
- ✅ **Domínio customizado** suportado
