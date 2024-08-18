class Planet1 extends PlanetScene {
  reset() {
    this.track = 'planet-1.mp3';
    this.player_pos = [width / 2, height * 0.9];
    this.player_size = [200, 200];
    this.player_image = images['you-shadow'];
    this.background = images['wood-bg'];
    this.bounding_rect = [350, 0, 0, 0];
    this.npcs = [
      new NPC({
        pos: [width * 0.5, height * 0.3],
        image: images['science-cat'],
        size: [200, 300],
        radius: 1,
        interact: async (count, reset_count) => {
          const result = this.level_results['tutorial'];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.CAT_INTRO, {
              skippable: false
            });
            this.spawn_abilities();
          } else if (!result) {
            if (this.npcs.length > 1) {
              await this.dialogue.send(DIALOGUE.CAT_INTRO_REPEAT, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.CAT_GOTO_LEVEL, {
                skippable: false
              });
              // Do it after two seconds so that it happens when ur already playing
              setTimeout(
                () => (this.player_pos = [width / 2, height * 0.9]),
                2000
              );
              await this.start_level('tutorial');
              this.play_track();
              reset_count();
            }
          } else {
            await this.dialogue.send(DIALOGUE.LEVEL_1_AFTER_TUTORIAL, {
              skippable: false
            });
          }
        }
      })
    ];
  }

  spawn_abilities() {
    this.npcs.push(
      new NPC({
        pos: [150, height - 250],
        image: images['ability-lazer-item'],
        size: [140, 140],
        max_interactions: 1,
        text: 'Press E to Pickup',
        text_side: 'bottom',
        text_width: 250,
        radius: 1.8,
        interact: async () => {
          this.set_ability('lazer');
          this.npcs.splice(1, 3);
        }
      }),
      new NPC({
        pos: [width / 2, height - 250],
        image: images['ability-shield-item'],
        size: [140, 140],
        max_interactions: 1,
        text: 'Press E to Pickup',
        text_side: 'bottom',
        text_width: 250,
        radius: 1.8,
        interact: async () => {
          this.set_ability('stealth');
          this.npcs.splice(1, 3);
        }
      }),
      new NPC({
        pos: [width - 150, height - 250],
        image: images['ability-clock-item'],
        size: [140, 140],
        max_interactions: 1,
        text: 'Press E to Pickup',
        text_side: 'bottom',
        text_width: 250,
        radius: 1.8,
        interact: async () => {
          this.set_ability('time');
          this.npcs.splice(1, 3);
        }
      })
    );
  }
}
