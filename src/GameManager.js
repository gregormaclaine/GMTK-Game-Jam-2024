class GameManager {
  static SKYSPEED = 1;

  constructor({ images, audio, dialogue, end_game, on_die }) {
    this.images = images;
    this.audio = audio;
    this.dialogue = dialogue;
    this.end_game = end_game;
    this.on_die = on_die;

    this.pause_modal = new PauseModal();
    this.background = images['bullet-bg'];
    this.reset();
    this.level_promise = null;
    this.on_finish_level = () => {};
  }

  reset() {
    this.sky_pos = 0;
    this.state = 'game';
    this.collected = {
      gigantium: 0,
      minimium: 0,
      size: 0,
      coins: 0
    };
    this.player = new Player({
      start_pos: [width / 2, height / 2],
      collected: this.collected,
      die: this.on_die
    });
    this.bullets = new BulletHell({
      player: this.player,
      collected: this.collected
    });
  }

  async run_level(level) {
    this.level_promise = new Promise(
      resolve => (this.on_finish_level = resolve)
    );

    this.reset();
    await timeout(1000);
    await this.bullets.level1();
    await timeout(1000);

    this.on_finish_level();
  }

  handle_click() {
    if (this.state === 'pause') return this.pause_modal.handle_click();

    this.bullets.handle_click();
  }

  handle_key_press() {
    if (this.state === 'pause') return this.pause_modal.handle_key_press();

    if (['game'].includes(this.state)) {
      const prev_state = this.state;
      if (keyCode === PAUSE_KEY_CODE) {
        this.pause_modal.open(() => (this.state = prev_state));
        return (this.state = 'pause');
      }
    }
  }

  draw_hud() {
    textSize(40);
    textAlign(CENTER, BASELINE);
    stroke(0);
    strokeWeight(0);
    fill(255);
    text('' + this.collected.gigantium, 70, 40);
    text('' + this.collected.minimium, 270, 40);

    imageMode('center');
    image(images['gigantium'], 30, 25, 40, 40);
    image(images['minimium'], 230, 25, 40, 40);
  }

  show() {
    imageMode(CORNER);
    image(this.background, 0, this.sky_pos - this.background.height);
    image(this.background, 0, this.sky_pos);
    this.bullets.show();
    this.player.show();
    this.draw_hud();
    if (this.state === 'pause') this.pause_modal.show();
  }

  update() {
    switch (this.state) {
      case 'game':
        this.sky_pos =
          (this.sky_pos + GameManager.SKYSPEED) % this.background.height;
        this.bullets.update();
        this.player.update();

        this.bullets.bullets.forEach(b => {
          if (b.hitbox.is_colliding(this.player.hitbox)) {
            if (this.player.take_damage()) {
              b.collide();
            }
          }
        });

      case 'pause':
        this.pause_modal.update();
        return;
    }
  }
}
