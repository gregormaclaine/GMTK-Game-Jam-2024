class CrayonPlanet extends PlanetScene {
  reset() {
    this.track = 'planet-3.mp3';
    this.player_pos = [width / 2, height * 0.9];
    this.player_size = [200, 200];
    this.player_image = images['you-shadow'];
    this.background = images['wood-bg'];
    this.bounding_rect = [0, 0, 0, 0];
    this.npcs = [
      new NPC({
        pos: [width * 0.1, height / 2],
        size: [200, 250],
        radius: 1.2,
        image: images['crayon-cat-1'],
        interact: async (count, reset_count) => {
          await this.dialogue.send(DIALOGUE.CRAYON_COFFEE_CAT);
        }
      }),
      new NPC({
        pos: [width * 0.3, height / 2],
        size: [200, 250],
        radius: 1.2,
        image: images['crayon-cat-2'],
        interact: async (count, reset_count) => {
          await this.dialogue.send(DIALOGUE.CRAYON_LEGS_CAT);
        }
      }),
      new NPC({
        pos: [width * 0.6, height / 2],
        size: [200, 250],
        radius: 1.2,
        image: images['crayon-cat-3'],
        interact: async (count, reset_count) => {
          await this.dialogue.send(DIALOGUE.CRAYON_WIZARD_CAT);
        }
      }),
      new NPC({
        pos: [width * 0.9, height / 2],
        size: [200, 250],
        radius: 1.2,
        image: images['crayon-cat-4'],
        interact: async (count, reset_count) => {
          await this.dialogue.send(DIALOGUE.CRAYON_GUN_CAT);
        }
      })
    ];
  }
}
