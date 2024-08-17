class SceneManager {
  static FADE_TIME = 0.8;

  constructor(images, audio) {
    this.images = images;
    this.audio = audio;

    this.state = 'menu';

    this.dialogue = new DialogueManager(images, audio);

    this.game_scene = new GameManager({
      images,
      audio,
      dialogue: this.dialogue
    });

    this.planet_scene = new PlanetScene({
      dialogue: this.dialogue,
      start_level: this.start_level.bind(this),
      fade: this.fade.bind(this),
      finish_game: this.finish_game.bind(this)
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

  async start_level(level) {
    await this.fade('out');
    this.state = 'game';
    this.game_scene.run_level(level);
    await this.fade('in');
    await this.game_scene.level_promise;
    await this.fade('out');
    if (this.game_scene.player.health <= 0) {
      this.state = 'gameover';
      this.planet_scene.level_results[level] = 'lose';
    } else {
      this.state = 'planet';
      this.planet_scene.level_results[level] = 'win';
    }
    await this.fade('in');
  }

  async start_game() {
    await this.fade('out');
    this.state = 'planet';
    this.planet_scene.reset();
    this.planet_scene.load_planet_1();
    await this.fade('in');
  }

  async finish_game({ collected, results }) {
    await this.fade('out');
    this.end_scene = new EndScene({
      collected,
      results,
      return_to_menu: async () => {
        await this.fade('out');
        this.state = 'menu';
        await this.fade('in');
      }
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
    if (this.dialogue.active) return;

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
