export class AssetLoader {
  static preloadAssets(scene) {
    console.log('AssetLoader: Iniciando carregamento de assets...');
    console.log('Base URL:', scene.load.baseURL || 'undefined');
      // Carrega o tileset e mapa
    scene.load.image("pacman tileset", "pac-man-tiles/tileset.png");
    scene.load.tilemapTiledJSON("map", "pacman-map.json");
      // Carrega sprites do Pacman
    scene.load.spritesheet("pacman", "pacman-characters/pacman/pacman0.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.spritesheet("pacman1", "pacman-characters/pacman/pacman1.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.spritesheet("pacman2", "pacman-characters/pacman/pacman2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.spritesheet("pacman3", "pacman-characters/pacman/pacman3.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.spritesheet("pacman4", "pacman-characters/pacman/pacman4.png", {
      frameWidth: 32,
      frameHeight: 32,
    });    // Sprites para a animação de morte do Pacman
    scene.load.spritesheet(
      "pacmanDeath1",
      "pac-man-life-death/pac man death/spr_pacdeath_0.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    scene.load.spritesheet(
      "pacmanDeath2",
      "pac-man-life-death/pac man death/spr_pacdeath_1.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    scene.load.spritesheet(
      "pacmanDeath3",
      "pac-man-life-death/pac man death/spr_pacdeath_2.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );// Itens do jogo (usando nova pasta sem espaços)
    console.log('Carregando dots da pasta: pacman-items/');
    scene.load.image("dot", "pacman-items/dot.png");
    scene.load.image("powerPill", "pacman-items/spr_power_pill_0.png");

    // Sprites dos fantasmas
    scene.load.spritesheet(
      "pinkGhost",
      "ghost/pink%20ghost/spr_ghost_pink_0.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    scene.load.spritesheet(
      "orangeGhost",
      "ghost/orange%20ghost/spr_ghost_orange_0.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    scene.load.spritesheet(
      "blueGhost",
      "ghost/blue%20ghost/spr_ghost_blue_0.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    scene.load.spritesheet("redGhost", "ghost/red%20ghost/spr_ghost_red_0.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.spritesheet(
      "scaredGhost",
      "ghost/ghost%20afraid/spr_afraid_0.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    scene.load.spritesheet(
      "scaredGhostWhite",
      "ghost/ghost%20afraid/spr_afraid_1.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );    // UI e outros elementos
    scene.load.image(
      "lifeCounter1",
      "pac-man-life-death/pac man life counter/spr_lifecounter_0.png"
    );
    scene.load.image(
      "lifeCounter2",
      "pac-man-life-death/pac man life counter/spr_lifecounter_0.png"
    );
  }
}
