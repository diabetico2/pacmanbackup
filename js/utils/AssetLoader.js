export class AssetLoader {
  static preloadAssets(scene) {
    // Carrega o tileset e mapa
    scene.load.image("pacman tileset", "pac%20man%20tiles/tileset.png");
    scene.load.tilemapTiledJSON("map", "pacman-map.json");
    
    // Carrega sprites do Pacman
    scene.load.spritesheet("pacman", "pacman%20characters/pacman/pacman0.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.spritesheet("pacman1", "pacman%20characters/pacman/pacman1.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.spritesheet("pacman2", "pacman%20characters/pacman/pacman2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.spritesheet("pacman3", "pacman%20characters/pacman/pacman3.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    scene.load.spritesheet("pacman4", "pacman%20characters/pacman/pacman4.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Sprites para a animação de morte do Pacman
    scene.load.spritesheet(
      "pacmanDeath1",
      "pac%20man%20%26%20life%20counter%20%26%20death/pac%20man%20death/spr_pacdeath_0.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    scene.load.spritesheet(
      "pacmanDeath2",
      "pac%20man%20%26%20life%20counter%20%26%20death/pac%20man%20death/spr_pacdeath_1.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    scene.load.spritesheet(
      "pacmanDeath3",
      "pac%20man%20%26%20life%20counter%20%26%20death/pac%20man%20death/spr_pacdeath_2.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    // Itens do jogo
    scene.load.image("dot", "pacman%20Items/dot.png");
    scene.load.image("powerPill", "pacman%20Items/spr_power_pill_0.png");

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
    );

    // UI e outros elementos
    scene.load.image(
      "lifeCounter1",
      "pac%20man%20%26%20life%20counter%20%26%20death/pac%20man%20life%20counter/spr_lifecounter_0.png"
    );
    scene.load.image(
      "lifeCounter2",
      "pac%20man%20%26%20life%20counter%20%26%20death/pac%20man%20life%20counter/spr_lifecounter_0.png"
    );
  }
}
