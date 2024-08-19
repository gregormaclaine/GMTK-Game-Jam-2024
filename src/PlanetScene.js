class PlanetScene {
  static PLAYER_SPEED = 8;

  constructor({
    dialogue,
    start_level,
    finish_game,
    set_ability,
    add_passive,
    level_results,
    move_world,
    audio,
    current_ability,
    passives,
    collected
  }) {
    this.dialogue = dialogue;
    this.audio = audio;
    this.start_level = start_level;
    this._finish_game = finish_game;
    this.set_ability = set_ability;
    this.add_passive = add_passive;
    this.level_results = level_results;
    this.move_world = move_world;
    this.current_ability = current_ability;
    this.current_passives = passives;
    this.collected = collected;

    this.reset();
    this.play_track();
  }

  reset() {
    this.player_pos = [width / 2, height / 2];
    this.player_size = [50, 50];
    this.player_image = images['rock'];
    this.background = images['bullet-bg'];
    this.track = 'planet-1.mp3';
    this.npcs = [];

    /** Movable region padding: [top, right, bottom, left] */
    this.bounding_rect = [0, 0, 0, 0];
  }

  play_track() {
    this.audio.play_track(this.track, true);
  }

  finish_game() {
    this._finish_game({
      collected: this.collected,
      results: this.level_results
    });
  }

  save_world_completion_status(planet, req_min, req_gig) {
    const win =
      this.collected.minimium >= req_min && this.collected.gigantium >= req_gig;

    this.level_results[planet] = win ? 'win' : 'lose';

    this.collected.minimium = 0;
    this.collected.gigantium = 0;
    this.collected.goal_gigantium = 0;
    this.collected.goal_minimium = 0;
    this.collected.size = 0;
  }

  handle_click() {}

  handle_key_press() {
    if (keyCode == 69) {
      for (const npc of this.npcs) {
        if (npc.is_interactable(this.player_pos)) {
          npc.interact();
          break;
        }
      }
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
    const [bt, br, bb, bl] = this.bounding_rect;
    // right
    if (this.player_pos[0] + size[0] / 2 > width - br) {
      this.player_pos[0] = width - br - size[0] / 2;
    }

    // left
    if (this.player_pos[0] - size[0] / 2 < bl) {
      this.player_pos[0] = bl + size[0] / 2;
    }

    // bottom
    if (this.player_pos[1] + size[1] / 2 > height - bb) {
      this.player_pos[1] = height - bb - size[1] / 2;
    }

    // top
    if (this.player_pos[1] - size[1] / 2 < bt) {
      this.player_pos[1] = bt + size[1] / 2;
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
