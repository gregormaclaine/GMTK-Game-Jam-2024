class PlanetScene {
  static PLAYER_SPEED = 8;

  constructor({
    dialogue,
    start_level,
    fade,
    finish_game,
    set_ability,
    add_passive
  }) {
    this.dialogue = dialogue;
    this.start_level = start_level;
    this.fade = fade;
    this._finish_game = finish_game;
    this.set_ability = set_ability;
    this.add_passive = add_passive;
    this.reset();

    this.player_pos = [width / 2, height / 2];
    this.player_size = [50, 50];
    this.player_image = images['rock'];
    this.background = images['bullet-bg'];
    this.npcs = [];
    this.invisible_ceiling = 0;
  }

  reset() {
    this.level_results = {};
  }

  load_planet_1() {
    this.player_pos = [width / 2, height * 0.9];
    this.player_size = [300, 300];
    this.player_image = images['rock'];
    this.background = images['wood-bg'];
    this.invisible_ceiling = 250;
    this.npcs = [
      new NPC({
        pos: [width * 0.5, height * 0.3],
        image: images['china-cat-profile'],
        size: [200, 200],
        interact: async (count, reset_count) => {
          const result = this.level_results['tutorial'];

          if (!result && count === 0) {
            await this.dialogue.send(DIALOGUE.CHINA_CAT_INTRO, {
              skippable: false
            });
            this.planet_1_add_abilities();
          } else if (!result) {
            if (this.npcs.length > 1) {
              await this.dialogue.send(DIALOGUE.CHINA_CAT_INTRO_REPEAT, {
                skippable: false
              });
            } else {
              await this.dialogue.send(DIALOGUE.CHINA_CAT_GOTO_LEVEL, {
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
            await this.dialogue.send(DIALOGUE.LEVEL_1_AFTER_TUTORIAL, {
              skippable: false
            });
          }
        }
      })
    ];
  }

  planet_1_add_abilities() {
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

  load_planet_2() {}
  load_planet_3() {}

  async go_to_planet(num) {
    await this.fade('out');
    if (num == 2) {
      this.load_planet_2();
    } else {
      this.load_planet_3();
    }
    await this.fade('in');
  }

  finish_game() {
    this._finish_game({
      collected: this.collected,
      results: this.level_results
    });
  }

  handle_click() {}
  handle_key_press() {
    if (keyCode == 69) {
      this.npcs.forEach(npc => {
        if (npc.is_interactable(this.player_pos)) npc.interact();
      });
    }
  }

  show() {
    imageMode(CORNER);
    background(this.background);

    this.npcs.forEach(n => n.show(this.player_pos));

    imageMode(CENTER);
    image(this.player_image, ...this.player_pos, ...this.player_size);
  }

  force_on_screen() {
    const size = this.player_size;
    if (this.player_pos[0] + size[0] / 2 > width) {
      this.player_pos[0] = width - size[0] / 2;
    }

    if (this.player_pos[0] - size[0] / 2 < 0) {
      this.player_pos[0] = size[0] / 2;
    }

    if (this.player_pos[1] + size[1] / 2 > height) {
      this.player_pos[1] = height - size[1] / 2;
    }

    if (this.player_pos[1] - size[1] / 2 < this.invisible_ceiling) {
      this.player_pos[1] = this.invisible_ceiling + size[1] / 2;
    }
  }

  update() {
    const vel = createVector(
      keyIsDown(68) - keyIsDown(65),
      keyIsDown(83) - keyIsDown(87)
    );
    vel.setMag(PlanetScene.PLAYER_SPEED);

    this.player_pos[0] += vel.x;
    this.player_pos[1] += vel.y;
    this.force_on_screen();
  }
}
