class CrayonPlanet extends PlanetScene {
  reset() {
    this.track = 'planet-3.mp3';
    this.player_pos = [width * 0.4, height * 0.9];
    this.player_size = [200, 200];
    this.player_image = images['you-shadow'];
    this.background = images['crayon-bg'];
    this.bounding_rect = [400, 0, 0, 0];
    this.npcs = [
      new NPC({
        pos: [width * 0.1, height * 0.35],
        size: [250, 300],
        radius: 1,
        image: images['crayon-cat-1'],
        interact: async (count, reset_count) => {
          const result = this.level_results[6];
          const result_1 = this.level_results[7];
          const result_2 = this.level_results[8];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_1, {
              skippable: false
            });
          } else if (!result) {  
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_1_REPEAT, {
              skippable: true
            });
          } else {
            if (result === 'lose' || result_1 === 'lose' || result_2 == 'lose') {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_1_FAIL, {
              skippable: false
            });
          } else {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_1_SUCCESS, {
              skippable: false
            });
          }
        }
        }
      }),
      new NPC({
        pos: [width * 0.4, height * 0.55],
        size: [250, 300],
        radius: 1,
        image: images['crayon-cat-2'],
        interact: async (count, reset_count) => {
          const result = this.level_results[6];
          const result_1 = this.level_results[7];
          const result_2 = this.level_results[8];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_2, {
              skippable: false
            });
          } else if (!result) {  
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_2_REPEAT, {
              skippable: true
            });
          } else {
            if (result === 'lose' || result_1 === 'lose' || result_2 == 'lose') {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_2_FAIL, {
              skippable: false
            });
          } else {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_2_SUCCESS, {
              skippable: false
            });
          }
        }
        if (count < 4) {
          await this.dialogue.send(DIALOGUE.CRAYON_CAT_2_ANNOYED);
        } else if (count >= 4) {
          await this.dialogue.send(DIALOGUE.CRAYON_CAT_2_ANGRY);
        }
        }
      }),
      new NPC({
        pos: [width * 0.9, height * 0.35],
        size: [250, 300],
        radius: 1,
        image: images['crayon-cat-3'],
        interact: async (count, reset_count) => {
          const result = this.level_results[3];
          const result_1 = this.level_results[4];
          const result_2 = this.level_results[5];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_3, {
              skippable: false
            });
          } else if (!result) {  
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_3_REPEAT, {
              skippable: true
            });
          } else if (this.collected.gigantium >= 5 && this.collected.minimium >= 5) {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_3_COLLECTED, {
              skippable: false
            });
            this.player_image = images['cat-mc'];
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_3_COLLECTED_CONT, {
              skippable: false
            });
          } else {
            if (result === 'lose' || result_1 === 'lose' || result_2 == 'lose') {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_3_FAIL, {
              skippable: true
            });
          } else {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_3_SUCCESS, {
              skippable: true
            });
          }
        }
        }
      }),
      new NPC({
        pos: [width * 0.8, height * 0.7],
        size: [250, 300],
        radius: 1,
        image: images['crayon-cat-4'],
        interact: async (count, reset_count) => {
          const result = this.level_results[3];
          const result_1 = this.level_results[4];
          const result_2 = this.level_results[5];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_4, {
              skippable: false
            });
          } else if (!result) {  
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_4_REPEAT, {
              skippable: true
            });
          } else {
            if (result === 'lose' || result_1 === 'lose' || result_2 == 'lose') {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_4_FAIL, {
              skippable: false
            });
          } else {
            await this.dialogue.send(DIALOGUE.CRAYON_CAT_4_SUCCESS, {
              skippable: false
            });
          }
        }          
        }
      }),
      new NPC({
        pos: [width * 0.1, height * 0.8],
        image: images['mystery-cat'],
        size: [250, 250],
        radius: 1,
        interact: async (count, reset_count) => {
          const result = this.level_results[6];
          const result_1 = this.level_results[7];
          const result_2 = this.level_results[8];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.MYSTERY_CAT_WORLD_3, {
              skippable: false
            });
          } else if (!result) {
            if (count === 1) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_REPEAT_WORLD_3, {
                skippable: false
              });
            }

            if (count >= 2) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_LEVEL_WORLD_3, {
                skippable: false
              });

              // Do it after two seconds so that it happens when ur already playing
              setTimeout(
                () => (this.player_pos = [width / 2, height * 0.9]),
                2000
              );
              await this.start_level(6);
              reset_count();
            }
          }
          if (result && !result_1) {
            if (count == 0) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_PREPARE_LEVEL_1_WORLD_3, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_LEVEL_1_WORLD_3, {
                skippable: false
              });
              await this.start_level(7);
              reset_count();
            }
          }
          if (result && result_1 && !result_2) {
            if (count == 0) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_PREPARE_LEVEL_2_WORLD_3, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_LEVEL_2_WORLD_3, {
                skippable: false
              });
              await this.start_level(8);
              reset_count();
            }
          }
          if (result && result_1 && result_2) {
            // Probably won't need this dialogue
            if (count == 0) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_PREPARE_WORLD_3, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_WORLD_3, {
                skippable: false
              });
              // ADD ENDINGS HERE INSTEAD OF MOVING WORLD
              // await this.move_world(3);
              reset_count();
            }
          }
        }
      }),
    ];
  }
}
