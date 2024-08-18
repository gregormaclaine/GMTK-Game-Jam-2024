class Planet1 extends PlanetScene {
  reset() {
    this.track = 'planet-1.mp3';
    this.player_pos = [width * 0.1, height * 0.9];
    this.player_size = [200, 200];
    this.player_image = images['you-shadow'];
    this.background = images['wood-bg'];
    this.bounding_rect = [350, 0, 0, 0];
    this.npcs = [
      new NPC({
        pos: [width * 0.1, height * 0.35],
        image: images['science-cat'],
        size: [200, 300],
        radius: 1,
        interact: async (count, reset_count) => {
          const result = this.level_results['tutorial'];
          const result_1 = this.level_results[1];
          const result_2 = this.level_results[2];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.CAT_INTRO, {
              skippable: false
            });
            this.spawn_abilities();
          } else if (!result) {
            if (this.npcs.length > 4) {
              await this.dialogue.send(DIALOGUE.CAT_INTRO_REPEAT, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.CAT_GOTO_LEVEL, {
                skippable: false
              });
            }
          } else {
            await this.dialogue.send(DIALOGUE.LEVEL_1_AFTER_TUTORIAL, {
              skippable: false
            });
          }
        }
      }),
      new NPC({
        pos: [width * 0.45, height * 0.6],
        image: images['cat'],
        size: [200, 300],
        radius: 1,
        interact: async (count, reset_count) => {
          const result = this.level_results['tutorial'];
          const result_1 = this.level_results[1];
          const result_2 = this.level_results[2];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.YOUNGER_SISTER_CAT, {
              skippable: true
            });
          } else if (!result) {  
            await this.dialogue.send(DIALOGUE.YOUNGER_SISTER_CAT_REPEAT, {
              skippable: false
            });
          } else {
            if (result === 'fail' || result_1 === 'fail' || result_2 == 'fail') {
            await this.dialogue.send(DIALOGUE.YOUNGER_SISTER_CAT_FAIL, {
              skippable: false
            });
          } else {
            await this.dialogue.send(DIALOGUE.YOUNGER_SISTER_CAT_SUCCESS, {
              skippable: false
            });
          }
        }
      }
      }),
      new NPC({
        pos: [width * 0.65, height * 0.4],
        image: images['evil-cat'],
        size: [200, 300],
        radius: 1,
        interact: async (count, reset_count) => {
          const result = this.level_results['tutorial'];
          const result_1 = this.level_results[1];
          const result_2 = this.level_results[2];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.OLDER_BROTHER_CAT, {
              skippable: true
            });
          } else if (!result) {  
            await this.dialogue.send(DIALOGUE.OLDER_BROTHER_CAT_REPEAT, {
              skippable: false
            });
          } else {
            if (result === 'fail' || result_1 === 'fail' || result_2 == 'fail') {
            await this.dialogue.send(DIALOGUE.OLDER_BROTHER_CAT_FAIL, {
              skippable: false
            });
          } else {
            await this.dialogue.send(DIALOGUE.OLDER_BROTHER_CAT_SUCCESS, {
              skippable: false
            });
          }
        }
      }
      }),
      new NPC({
        pos: [width * 0.95, height * 0.55],
        image: images['mystery-cat'],
        size: [200, 300],
        radius: 1,
        interact: async (count, reset_count) => {
          const result = this.level_results['tutorial'];
          const result_1 = this.level_results[1];
          const result_2 = this.level_results[2];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.MYSTERY_CAT, {
              skippable: false
            });
          } else if (!result) {
            if (this.npcs.length > 4) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_REPEAT, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_LEVEL, {
                skippable: false
              });
              // Do it after two seconds so that it happens when ur already playing
              setTimeout(
                () => (this.player_pos = [width / 2, height * 0.9]),
                2000
              );
              await this.start_level('tutorial');
              reset_count();
            }
          } else {
            await this.dialogue.send(DIALOGUE.LEVEL_1_AFTER_TUTORIAL_MYSTERY_CAT, {
              skippable: false
            });
          }
          if (result && !result_1) {
            if (count == 0) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_PREPARE_LEVEL_1, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_LEVEL_1, {
                skippable: false
              });
              await this.start_level(1);
              reset_count();
            }
          }
          if (result && result_1 && !result_2) {
            if (count == 0) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_PREPARE_LEVEL_2, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_LEVEL_2, {
                skippable: false
              });
              await this.start_level(2);
              reset_count();
            }
          }
          if (result && result_1 && result_2) {
            if (count == 0) {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_PREPARE_WORLD_2, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_WORLD_2, {
                skippable: false
              });
              await this.move_world(2);
              reset_count();
            }
          }
        }
      })
    ];
  }

  spawn_abilities() {
    this.npcs.push(
      new NPC({
        pos: [150, height - 125],
        image: images['ability-lazer-item'],
        size: [140, 140],
        max_interactions: 1,
        text: 'Press E to Pickup',
        text_side: 'bottom',
        text_width: 250,
        radius: 1.8,
        interact: async () => {
          this.set_ability('lazer');
          this.npcs.splice(4, 6);
        }
      }),
      new NPC({
        pos: [width / 2, height - 125],
        image: images['ability-shield-item'],
        size: [140, 140],
        max_interactions: 1,
        text: 'Press E to Pickup',
        text_side: 'bottom',
        text_width: 250,
        radius: 1.8,
        interact: async () => {
          this.set_ability('stealth');
          this.npcs.splice(4, 6);
        }
      }),
      new NPC({
        pos: [width - 150, height - 125],
        image: images['ability-clock-item'],
        size: [140, 140],
        max_interactions: 1,
        text: 'Press E to Pickup',
        text_side: 'bottom',
        text_width: 250,
        radius: 1.8,
        interact: async () => {
          this.set_ability('time');
          this.npcs.splice(4, 6);
        }
      })
    );
  }
}
