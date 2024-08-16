class SceneManager {
  static FADE_TIME = 0.8;

  constructor(images, audio) {
    this.images = images;
    this.audio = audio;

    this.state = 'menu';
    this.score = 0;
    this.current_game_day = -1;
    this.current_difficulty = -1;
    this.fish_left = 3;

    this.dialogue = new DialogueManager(images, audio);

    this.menu_scene = new MenuScreen(
      images,
      this.dialogue,
      this.start_game.bind(this)
    );
    this.end_scene = new EndScreen(
      images,
      this.audio,
      this.dialogue,
      this.exit_end_screen.bind(this)
    );
    this.shop_scene = new ShopScreen(
      images,
      audio,
      this.dialogue,
      this.exit_menu.bind(this)
    );

    this.fade_mode = null;
    this.fade_progress = 0;
    this.fade_completed = () => {};

    this.introduced_invisibility = false;
  }

  async start_game() {
    await this.fade('out');
    await this.initialise_new_game_day();
    this.state = 'game';
    this.audio.play_track('game.mp3');
    await this.fade('in');
    await this.dialogue.send(DIALOGUE.BEFORE_GAME);
  }

  async initialise_new_game_day() {
    this.current_game_day++;
    this.current_difficulty++;

    if (this.current_difficulty === 3 && !this.introduced_invisibility) {
      await this.dialogue.send(DIALOGUE.INTRODUCE_INVISIBILITY);
      this.introduced_invisibility = true;
    }

    this.game_scene = new GameManager({
      images: this.images,
      audio: this.audio,
      end_game: this.end_game.bind(this),
      day: this.current_game_day,
      difficulty: this.current_difficulty,
      upgrades: this.shop_scene.unlocked_upgrades,
      dialogue: this.dialogue,
      fish_left: this.fish_left,
      has_ab: ab => this.shop_scene.unlocked_upgrades[ab]
    });
  }

  async fade(mode) {
    this.fade_mode = mode;
    this.fade_progress = 0;
    await new Promise(resolve => (this.fade_completed = resolve));
    this.fade_mode = null;
  }

  async end_game({ fish_lost, score }) {
    this.score += score;
    if (fish_lost) {
      this.fish_left--;
      this.current_difficulty--;
    }

    if (this.current_game_day === 0) {
      await this.dialogue.send(DIALOGUE.AFTER_GAME);
    }

    await this.fade('out');
    if (this.current_game_day < 4 && this.fish_left > 0) {
      this.state = 'shop';
      this.audio.play_track('shop.mp3');
      this.shop_scene.open(fish_lost, this.score);
    } else {
      this.state = 'end';
      this.end_scene.open({
        result: this.fish_left > 0 ? 'win' : 'lose',
        fish_left: this.fish_left,
        final_score: this.score
      });
    }
    await this.fade('in');

    if (this.current_game_day === 0) {
      await this.dialogue.send(DIALOGUE.BEFORE_SHOP);
    }
  }

  async exit_menu() {
    await this.fade('out');
    this.state = 'game';
    this.initialise_new_game_day();
    this.audio.play_track('game.mp3');
    await this.fade('in');
  }

  async exit_end_screen() {
    await this.fade('out');
    this.state = 'menu';
    await this.fade('in');
  }

  handle_click() {
    if (this.fade_mode) return;

    if (this.dialogue.active) return this.dialogue.handle_click();

    switch (this.state) {
      case 'game':
        return this.game_scene.handle_click();
      case 'shop':
        return this.shop_scene.handle_click();
      case 'menu':
        return this.menu_scene.handle_click();
      case 'end':
        return this.end_scene.handle_click();
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

      case 'shop':
        this.shop_scene.show();
        break;

      case 'menu':
        this.menu_scene.show();
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

      case 'shop':
        this.shop_scene.update();
        break;

      case 'menu':
        this.menu_scene.update();
        break;

      case 'end':
        this.end_scene.update();
        break;
    }
  }
}
