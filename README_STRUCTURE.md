# Pacman Game - Estrutura Modular

## Visão Geral

Este projeto foi refatorado de um arquivo monolítico (`main.js`) para uma estrutura modular bem organizada, facilitando a manutenção e expansão do jogo.

## Estrutura do Projeto

```
PacManOnline/
├── index.html              # Arquivo principal HTML
├── game.js                 # Ponto de entrada do jogo
├── style.css              # Estilos CSS
├── main.js                # [ARQUIVO ANTIGO] - Pode ser removido
├── js/                    # Código JavaScript modular
│   ├── config/
│   │   └── GameConfig.js  # Configurações do jogo
│   ├── entities/
│   │   ├── PacmanEntity.js # Classe do Pacman
│   │   └── GhostEntity.js  # Classe dos Fantasmas
│   ├── systems/
│   │   ├── MovementSystem.js    # Sistema de movimento
│   │   ├── GhostAI.js          # Inteligência artificial dos fantasmas
│   │   ├── PathfindingSystem.js # Sistema de pathfinding (A*)
│   │   ├── InputSystem.js      # Sistema de entrada do usuário
│   │   └── GameManager.js      # Gerenciamento do jogo
│   ├── utils/
│   │   └── AssetLoader.js      # Carregamento de assets
│   └── PacmanScene.js          # Cena principal do jogo
├── assets/                     # Assets do jogo (imagens, mapas, etc.)
└── README_STRUCTURE.md        # Este arquivo
```

## Descrição dos Módulos

### Config
- **GameConfig.js**: Contém todas as configurações do jogo, como velocidades, pontuações, dimensões, etc.

### Entities
- **PacmanEntity.js**: Classe que gerencia o sprite e comportamentos do Pacman
- **GhostEntity.js**: Classe que gerencia os sprites e comportamentos dos fantasmas

### Systems
- **MovementSystem.js**: Responsável pela lógica de movimento de todas as entidades
- **GhostAI.js**: Implementa a inteligência artificial dos fantasmas (modos scatter, chase, scared)
- **PathfindingSystem.js**: Implementa o algoritmo A* para navegação dos fantasmas
- **InputSystem.js**: Gerencia a entrada do usuário (teclas de direção)
- **GameManager.js**: Controla o estado do jogo (pontuação, vidas, colisões, etc.)

### Utils
- **AssetLoader.js**: Centraliza o carregamento de todos os assets do jogo

### Core
- **PacmanScene.js**: Cena principal que coordena todos os sistemas
- **game.js**: Ponto de entrada que inicializa o jogo Phaser

## Vantagens da Nova Estrutura

1. **Modularidade**: Cada funcionalidade está em seu próprio arquivo
2. **Manutenibilidade**: Mudanças em uma funcionalidade não afetam outras
3. **Reutilização**: Classes e sistemas podem ser facilmente reutilizados
4. **Testabilidade**: Cada módulo pode ser testado independentemente
5. **Escalabilidade**: Novas funcionalidades podem ser adicionadas facilmente
6. **Organização**: Código bem estruturado e fácil de navegar

## Como Executar

1. Certifique-se de que está executando em um servidor local (devido aos módulos ES6)
2. Abra `index.html` no navegador
3. O jogo carregará automaticamente usando a nova estrutura modular

## Adicionando Novas Funcionalidades

### Para adicionar um novo tipo de entidade:
1. Crie uma nova classe em `js/entities/`
2. Importe e use na `PacmanScene.js`

### Para adicionar um novo sistema:
1. Crie uma nova classe em `js/systems/`
2. Inicialize na `PacmanScene.js`
3. Chame os métodos necessários no loop `update()`

### Para modificar configurações:
1. Edite `js/config/GameConfig.js`
2. As mudanças serão refletidas automaticamente

## Exemplos de Futuras Implementações

- Sistema de power-ups especiais
- Múltiplos níveis com layouts diferentes
- Sistema de high scores
- Efeitos sonoros e música
- Multiplayer local
- Sistema de conquistas

## Migração do Código Antigo

O arquivo `main.js` original ainda existe e pode ser usado como referência. Uma vez que a nova estrutura esteja funcionando corretamente, o arquivo antigo pode ser removido.
