class SceneManager {
  static FADE_TIME = 0.8;

  constructor(images, audio) {
    this.images = images;
    this.audio = audio;

    this.state = 'menu';
    this.level_results = {};
    this.collected = {
      gigantium: 0,
      minimium: 0,
      size: 0,
      goal_gigantium: 0,
      goal_minimium: 0
    };

    this.dialogue = new DialogueManager(images, audio);

    this.game_scene = new GameManager({
      images,
      audio,
      dialogue: this.dialogue,
      collected: this.collected
    });

    this.menu_scene = new MenuScreen(
      images,
      this.dialogue,
      this.start_game.bind(this)
    );

    this.gameover_scene = new GameOverScene(async () => {
      await this.fade('out');
      this.state = 'planet';
      await this.fade('in');
    });

    this.fade_mode = null;
    this.fade_progress = 0;
    this.fade_completed = () => {};
  }

  load_planet(planet) {
    const planet_props = {
      dialogue: this.dialogue,
      audio: this.audio,
      start_level: this.start_level.bind(this),
      finish_game: this.finish_game.bind(this),
      set_ability: ability => {
        this.game_scene.set_ability(ability);
      },
      add_passive: passive => {
        this.game_scene.add_passive(passive);
      },
      level_results: this.level_results,
      move_world: this.move_world.bind(this),
      current_ability: () => this.game_scene.ability,
      passives: () => this.game_scene.passives,
      collected: this.collected
    };

    if (planet === 1) {
      this.planet_scene = new Planet1(planet_props);
    } else if (planet === 2) {
      this.planet_scene = new DarkPlanet(planet_props);
    } else if (planet === 3) {
      this.planet_scene = new CrayonPlanet(planet_props);
    } else {
      console.error('Planet not found:', planet);
    }
  }

  async move_world(planet) {
    await this.fade('out');
    this.load_planet(planet);
    await this.fade('in');
  }

  async start_level(level) {
    await this.fade('out');
    this.state = 'game';

    const previous_minimium = this.collected.minimium;
    const previous_gigantium = this.collected.gigantium;

    this.game_scene.run_level(level);
    await this.fade('in');
    await this.game_scene.level_promise;
    await this.fade('out');
    this.collected.size = 0;
    if (this.game_scene.player.health <= 0) {
      this.state = 'gameover';
      this.planet_scene.level_results[level] = 'lose';
      this.collected.minimium = previous_minimium;
      this.collected.gigantium = previous_gigantium;
    } else {
      this.state = 'planet';
      this.planet_scene.level_results[level] = 'win';
    }
    this.planet_scene.play_track();
    await this.fade('in');
  }

  async start_game() {
    await this.fade('out');
    this.state = 'planet';
    this.level_results = {};
    this.collected = {
      gigantium: 0,
      minimium: 0,
      size: 0,
      goal_gigantium: 0,
      goal_minimium: 0
    };
    this.game_scene.hard_reset();
    this.load_planet(1);
    await this.fade('in');
  }

  async finish_game({ collected, results }) {
    await this.fade('out');
    this.audio.stop();
    this.end_scene = new EndScene({
      collected,
      results,
      return_to_menu: async () => {
        await this.fade('out');
        this.state = 'menu';
        await this.fade('in');
      },
      dialogue: this.dialogue,
      audio: this.audio
    });
    this.state = 'end';
    await this.fade('in');
  }

  async fade(mode) {
    this.fade_mode = mode;
    this.fade_progress = 0;
    await new Promise(resolve => (this.fade_completed = resolve));
    this.fade_mode = null;
  }

  handle_click() {
    if (this.fade_mode) return;

    if (this.dialogue.active) return this.dialogue.handle_click();

    switch (this.state) {
      case 'game':
        return this.game_scene.handle_click();
      case 'menu':
        return this.menu_scene.handle_click();
      case 'planet':
        return this.planet_scene.handle_click();
      case 'gameover':
        return this.gameover_scene.handle_click();
      case 'end':
        return this.end_scene.handle_click();
    }
  }

  handle_key_press() {
    if (this.fade_mode) return;
    if (this.dialogue.active) return this.dialogue.handle_key_press();

    if (this.state === 'game') this.game_scene.handle_key_press();
    if (this.state === 'planet') this.planet_scene.handle_key_press();
  }

  show() {
    switch (this.state) {
      case 'game':
        this.game_scene.show();
        break;

      case 'menu':
        this.menu_scene.show();
        break;

      case 'planet':
        this.planet_scene.show();
        break;

      case 'gameover':
        this.gameover_scene.show();
        break;

      case 'end':
        this.end_scene.show();
        break;
    }

    if (this.dialogue.active) this.dialogue.show();

    if (this.fade_mode) {
      const opacities = this.fade_mode === 'in' ? [255, 0] : [0, 255];
      fill(0, lerp(...opacities, this.fade_progress));
      strokeWeight(0);
      rectMode(CORNERS);
      rect(0, 0, width, height);
    }
  }

  update() {
    if (this.fade_mode) {
      this.fade_progress += 1 / SceneManager.FADE_TIME / frameRate();
      if (this.fade_progress >= 1) this.fade_completed();
    }

    if (this.dialogue.active) return this.dialogue.update();

    switch (this.state) {
      case 'game':
        this.game_scene.update();
        break;

      case 'planet':
        this.planet_scene.update();
        break;

      case 'menu':
        this.menu_scene.update();
        break;

      case 'gameover':
        this.gameover_scene.update();
        break;

      case 'end':
        this.end_scene.update();
        break;
    }
  }
}
