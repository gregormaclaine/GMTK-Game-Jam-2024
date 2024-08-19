class DarkPlanet extends PlanetScene {
  reset() {
    this.track = 'planet-2.mp3';
    this.player_pos = [width / 2, height * 0.9];
    this.player_size = [200, 200];
    this.player_image = images['you-shadow-dark'];
    this.background = images['dark-bg'];
    this.bounding_rect = [150, 0, 0, 150];
    this.npcs = [
      new NPC({
        pos: [width * 0.5, height * 0.6],
        image: images['bw-cat-1'],
        size: [275, 275],
        radius: 0.8,
        interact: async (count, reset_count) => {
          const result = this.level_results[3];
          const result_1 = this.level_results[4];
          const result_2 = this.level_results[5];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.BW_CAT_1, {
              skippable: true
            });
          } else if (!result) {
            await this.dialogue.send(DIALOGUE.BW_CAT_1_REPEAT, {
              skippable: true
            });
          } else {
            if (
              result === 'lose' ||
              result_1 === 'lose' ||
              result_2 == 'lose'
            ) {
              await this.dialogue.send(DIALOGUE.BW_CAT_1_FAIL, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.BW_CAT_1_SUCCESS, {
                skippable: false
              });
            }
          }
        }
      }),

      new NPC({
        pos: [width * 0.13, height * 0.85],
        image: images['bw-cat-2'],
        size: [125, 375],
        radius: 1.8,
        interact: async (count, reset_count) => {
          const result = this.level_results[3];
          const result_1 = this.level_results[4];
          const result_2 = this.level_results[5];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.BW_CAT_2, {
              skippable: true
            });
          } else if (!result) {
            await this.dialogue.send(DIALOGUE.BW_CAT_2_REPEAT, {
              skippable: true
            });
          } else {
            if (
              result === 'lose' ||
              result_1 === 'lose' ||
              result_2 == 'lose'
            ) {
              await this.dialogue.send(DIALOGUE.BW_CAT_2_FAIL, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.BW_CAT_2_SUCCESS, {
                skippable: false
              });
            }
          }
        }
      }),

      new NPC({
        pos: [width * 0.25, height * 0.25],
        image: images['bw-cat-3'],
        size: [400, 250],
        radius: 0.6,
        interact: async (count, reset_count) => {
          const result = this.level_results[3];
          const result_1 = this.level_results[4];
          const result_2 = this.level_results[5];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.BW_CAT_3, {
              skippable: true
            });
          } else if (!result) {
            await this.dialogue.send(DIALOGUE.BW_CAT_3_REPEAT, {
              skippable: true
            });
          } else {
            if (
              result === 'lose' ||
              result_1 === 'lose' ||
              result_2 == 'lose'
            ) {
              await this.dialogue.send(DIALOGUE.BW_CAT_3_FAIL, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.BW_CAT_3_SUCCESS, {
                skippable: false
              });
            }
          }
        }
      }),

      new NPC({
        pos: [width * 0.85, height * 0.45],
        image: images['bw-cat-4'],
        size: [350, 200],
        radius: 1,
        interact: async (count, reset_count) => {
          const result = this.level_results[3];
          const result_1 = this.level_results[4];
          const result_2 = this.level_results[5];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.BW_CAT_4, {
              skippable: true
            });
          } else if (!result) {
            await this.dialogue.send(DIALOGUE.BW_CAT_4_REPEAT, {
              skippable: true
            });
          } else {
            if (
              result === 'lose' ||
              result_1 === 'lose' ||
              result_2 == 'lose'
            ) {
              await this.dialogue.send(DIALOGUE.BW_CAT_4_FAIL, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.BW_CAT_4_SUCCESS, {
                skippable: false
              });
            }
          }
        }
      }),

      new NPC({
        pos: [width * 0.92, height * 0.9],
        image: images['mystery-cat'],
        size: [250, 250],
        radius: 1,
        interact: async (count, reset_count) => {
          const result = this.level_results[3];
          const result_1 = this.level_results[4];
          const result_2 = this.level_results[5];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.MYSTERY_CAT_WORLD_2, {
              skippable: false
            });
          } else if (!result) {
            if (count === 1) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_REPEAT_WORLD_2, {
                skippable: false
              });
            }

            if (count >= 2) {
              await this.dialogue.send(
                DIALOGUE.MYSTERY_CAT_GOTO_LEVEL_WORLD_2,
                {
                  skippable: false
                }
              );

              // Do it after two seconds so that it happens when ur already playing
              setTimeout(
                () => (this.player_pos = [width / 2, height * 0.9]),
                2000
              );
              await this.start_level(3);
              reset_count();
            }
          }
          if (result && !result_1) {
            if (count == 0) {
              await this.dialogue.send(
                DIALOGUE.MYSTERY_CAT_PREPARE_LEVEL_1_WORLD_2,
                {
                  skippable: false
                }
              );
            } else {
              await this.dialogue.send(
                DIALOGUE.MYSTERY_CAT_GOTO_LEVEL_1_WORLD_2,
                {
                  skippable: false
                }
              );
              await this.start_level(4);
              reset_count();
            }
          }
          if (result && result_1 && !result_2) {
            if (count == 0) {
              await this.dialogue.send(
                DIALOGUE.MYSTERY_CAT_PREPARE_LEVEL_2_WORLD_2,
                {
                  skippable: false
                }
              );
            } else {
              await this.dialogue.send(
                DIALOGUE.MYSTERY_CAT_GOTO_LEVEL_2_WORLD_2,
                {
                  skippable: false
                }
              );
              await this.start_level(5);
              reset_count();
            }
          }
          if (result && result_1 && result_2) {
            if (count == 0) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_PREPARE_WORLD_3, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_WORLD_3, {
                skippable: false
              });
              await this.move_world(3);
              reset_count();
            }
          }
        }
      })
    ];
  }
}
