class SceneManager {
  static FADE_TIME = 0.8;

  constructor(images, audio) {
    this.images = images;
    this.audio = audio;

    this.state = 'menu';

    this.dialogue = new DialogueManager(images, audio);

    this.game_scene = new GameManager({ images, audio });

    this.menu_scene = new MenuScreen(
      images,
      this.dialogue,
      this.start_game.bind(this)
    );

    this.fade_mode = null;
    this.fade_progress = 0;
    this.fade_completed = () => {};
  }

  async start_game() {
    await this.fade('out');
    this.state = 'game';
    // this.audio.play_track('game.mp3');
    await this.fade('in');
    // await this.dialogue.send(DIALOGUE.BEFORE_GAME);
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
    }
  }

  handle_key_press() {
    if (this.fade_mode) return;
    if (this.dialogue.active) return;

    if (this.state === 'game') this.game_scene.handle_key_press();
  }

  show() {
    background(0);

    switch (this.state) {
      case 'game':
        this.game_scene.show();
        break;

      case 'menu':
        this.menu_scene.show();
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

      case 'menu':
        this.menu_scene.update();
        break;
    }
  }
}
