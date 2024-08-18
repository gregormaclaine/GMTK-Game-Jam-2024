class CrayonPlanet extends PlanetScene {
  reset() {
    this.track = 'planet-3.mp3';
    this.player_pos = [width * 0.2, height * 0.9];
    this.player_size = [200, 200];
    this.player_image = images['you-shadow'];
    this.background = images['crayon-bg'];
    this.bounding_rect = [400, 0, 0, 0];
    this.npcs = [
      new NPC({
        pos: [width * 0.1, height * 0.35],
        size: [200, 250],
        radius: 1.2,
        image: images['crayon-cat-1'],
        interact: async (count, reset_count) => {
          const result5 = this.level_results[5];
          const result6 = this.level_results[5];
          if (!result5 || !result6) {
            await this.dialogue.send(DIALOGUE.CRAYON_COFFEE_CAT_BLOCK);
            return;
          }

          await this.dialogue.send(DIALOGUE.CRAYON_COFFEE_CAT);
          this.level_results['planet3'] =
            result5 === 'win' || result6 === 'win' ? 'win' : 'lose';
          this.finish_game();
        }
      }),
      new NPC({
        pos: [width * 0.4, height * 0.55],
        size: [200, 250],
        radius: 1.2,
        image: images['crayon-cat-2'],
        interact: async (count, reset_count) => {
          const result = this.level_results[5];
          if (!result) {
            await this.dialogue.send(DIALOGUE.CRAYON_LEGS_CAT);
            await this.start_level(5);
            this.play_track();
            return;
          } else {
            await this.dialogue.send(DIALOGUE.CRAYON_LEGS_CAT_AFTER);
          }
        }
      }),
      new NPC({
        pos: [width * 0.9, height * 0.35],
        size: [200, 250],
        radius: 1.2,
        image: images['crayon-cat-3'],
        interact: async (count, reset_count) => {
          const result = this.level_results[6];
          if (!result) {
            await this.dialogue.send(DIALOGUE.CRAYON_WIZARD_CAT);
            this.before_wizard_minimium = this.collected.minimium;
            this.collected.goal_minimium = 20;
            await this.start_level(6);
            this.play_track();
            return;
          }

          const amount = this.collected.minimium - this.before_wizard_minimium;
          if (result === 'win' && amount >= 20) {
            await this.dialogue.send(DIALOGUE.CRAYON_WIZARD_CAT_WIN);
          } else {
            await this.dialogue.send(DIALOGUE.CRAYON_WIZARD_CAT_LOSS);
          }
        }
      }),
      new NPC({
        pos: [width * 0.8, height * 0.85],
        size: [200, 250],
        radius: 1.2,
        image: images['crayon-cat-4'],
        interact: async (count, reset_count) => {
          if (count === 0) {
            await this.dialogue.send(DIALOGUE.CRAYON_GUN_CAT);
          } else if (count < 4) {
            await this.dialogue.send(DIALOGUE.CRAYON_GUN_CAT_2);
          } else if (count === 4) {
            await this.dialogue.send(DIALOGUE.CRAYON_GUN_CAT_3);
          }
        }
      })
    ];
  }
}
