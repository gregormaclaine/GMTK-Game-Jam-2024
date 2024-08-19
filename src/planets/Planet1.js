class Planet1 extends PlanetScene {
  reset() {
    this.received_ability = false;

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
          const tut_result = this.level_results['tutorial'];
          const result_1 = this.level_results[1];
          const result_2 = this.level_results[2];

          // First time speaking to cat
          if (count === 0) {
            // If you've already done tutorial - dont say the last line
            const d = DIALOGUE.CAT_INTRO.slice(
              0,
              tut_result === 'win' ? -1 : undefined
            );
            await this.dialogue.send(d, { skippable: false });
          }

          // Repeat talking to cat before tutorial is played
          if (count !== 0 && tut_result !== 'win') {
            await this.dialogue.send(DIALOGUE.CAT_INTRO_REPEAT_BEFORE_TUTORIAL);
            return;
          }

          if (tut_result !== 'win') return;

          // speaking to cat after tutorial is played
          if (tut_result && this.npcs.length === 4 && !this.received_ability) {
            this.collected.goal_minimium = 30;
            this.collected.goal_gigantium = 30;

            await this.dialogue.send(DIALOGUE.SCIENCE_CAT_INTRO_ABILITIES, {
              skippable: false
            });
            this.spawn_abilities();
            return;
          }

          // None of the following text should be said on first interaction
          if (count === 0) return;

          // speaking to cat after abilities have spawned
          if (!this.received_ability) {
            await this.dialogue.send(DIALOGUE.CAT_ABILITIES_REPEAT);
            return;
          }

          // speaking to cat after having chosing abilities
          if (!result_1 && !result_2) {
            await this.dialogue.send(DIALOGUE.CAT_GOTO_LEVEL, {
              skippable: false
            });
            return;
          }

          // after tutorials and ability pickup
          await this.dialogue.send(DIALOGUE.LEVEL_1_AFTER_TUTORIAL, {
            skippable: false
          });
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

          //  before tutorial
          if (result !== 'win') {
            if (count === 0) {
              await this.dialogue.send(DIALOGUE.YOUNGER_SISTER_CAT, {
                skippable: true
              });
            } else {
              await this.dialogue.send(DIALOGUE.YOUNGER_SISTER_CAT_REPEAT);
            }
            return;
          }

          if (result_1 === 'lose' || result_2 == 'lose') {
            await this.dialogue.send(DIALOGUE.YOUNGER_SISTER_CAT_FAIL, {
              skippable: false
            });
          } else {
            await this.dialogue.send(DIALOGUE.YOUNGER_SISTER_CAT_SUCCESS, {
              skippable: false
            });
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

          // before tutorial is won
          if (result !== 'win') {
            if (count === 0) {
              await this.dialogue.send(DIALOGUE.OLDER_BROTHER_CAT, {
                skippable: true
              });
            } else {
              await this.dialogue.send(DIALOGUE.OLDER_BROTHER_CAT_REPEAT, {
                skippable: false
              });
            }
            return;
          }

          // before level 1
          if (!result_1) {
            await this.dialogue.send(
              DIALOGUE.OLDER_BROTHER_CAT_BEFORE_LEVEL_1,
              { skippable: false }
            );
            return;
          }

          // after level 1 response
          if (result_1 === 'lose' || result_2 == 'lose') {
            await this.dialogue.send(DIALOGUE.OLDER_BROTHER_CAT_FAIL);
          } else {
            await this.dialogue.send(DIALOGUE.OLDER_BROTHER_CAT_SUCCESS);
          }
        }
      }),
      new NPC({
        pos: [width * 0.95, height * 0.55],
        image: images['mystery-cat'],
        size: [200, 300],
        radius: 1,
        interact: async (count, reset_count) => {
          const result_tut = this.level_results['tutorial'];
          const result_1 = this.level_results[1];
          const result_2 = this.level_results[2];

          // first time speaking - leads to tutorial
          if (count === 0) {
            await this.dialogue.send(DIALOGUE.MYSTERY_CAT_INTRO, {
              skippable: false
            });
            await this.start_level('tutorial');
            return;
          }

          if (result_tut === 'lose') {
            await this.dialogue.send(DIALOGUE.MYSTERY_CAT_FAIL);
            await this.start_level('tutorial');
            return;
          }

          // block after tutorial until received ability
          if (!this.received_ability) {
            if (!this.mystery_cat_introd_abilities) {
              this.mystery_cat_introd_abilities = true;
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_BEFORE_ABILITY);
            } else {
              await this.dialogue.send(DIALOGUE.MYSTERY_CAT_REPEAT);
            }
            return;
          }

          // after ability - start level 1
          if (!result_1) {
            await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_LEVEL_1, {
              skippable: false
            });
            await this.start_level(1);
            reset_count();
            return;
          }

          if (!result_2) {
            if (!this.mystery_cat_prepared_2) {
              this.mystery_cat_prepared_2 = true;
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
            return;
          }

          if (!this.mystery_cat_prepared_world) {
            this.mystery_cat_prepared_world = true;
            await this.dialogue.send(DIALOGUE.MYSTERY_CAT_PREPARE_WORLD_2, {
              skippable: false
            });
          } else {
            await this.dialogue.send(DIALOGUE.MYSTERY_CAT_GOTO_WORLD_2, {
              skippable: false
            });
            this.save_world_completion_status('planet1');
            this.move_world(2);
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
          this.npcs.splice(4, 3);
          this.received_ability = true;
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
          this.npcs.splice(4, 3);
          this.received_ability = true;
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
          this.npcs.splice(4, 3);
          this.received_ability = true;
        }
      })
    );
  }
}
