class GameManager {
  static SKYSPEED = 1;

  constructor({ images, audio, dialogue }) {
    this.images = images;
    this.audio = audio;
    this.dialogue = dialogue;

    this.pause_modal = new PauseModal();
    this.background = images['bullet-bg'];
    this.level_promise = null;
    this.on_finish_level = null;

    this.hard_reset();

    this.ability_cooldown = new AbilityCooldown(
      2,
      'red',
      this.use_ability.bind(this)
    );
  }

  hard_reset() {
    this.ability = null;
    this.reset();
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
      die: () => {
        if (this.on_finish_level) this.on_finish_level();
        this.on_finish_level = null;
      }
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
    switch (level) {
      case 1:
        await this.bullets.level1();
        break;
      case 2:
        await this.bullets.level2();
        break;
      case 3:
        await this.bullets.level3();
        break;
    }

    if (this.on_finish_level) {
      await timeout(1000);
      this.player.ascending = true;
      await new Promise(resolve => (this.player.on_ascended = resolve));
      this.on_finish_level();
    }
  }

  set_ability(ability) {
    this.ability = ability;
    this.ability_cooldown.cooldown = 2;
  }

  use_ability() {
    switch (this.ability) {
      case 'lazer':
        this.bullets.shoot();
      default:
        return;
    }
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

      if (keyCode === 80 && this.ability) {
        this.ability_cooldown.activate();
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

    const heart_width = 60;
    const heart_gap = 10;
    const left_x = width - heart_gap * 3 - heart_width * 4 - 20;
    imageMode(CORNER);
    for (let i = 0; i < 4; i++) {
      tint(255, this.player.health > i ? 255 : 30);
      image(
        images['cat-heart'],
        left_x + (heart_gap + heart_width) * i,
        height - heart_width - 20,
        heart_width,
        heart_width
      );
      tint(255, 255);
    }

    if (this.ability) {
      if (this.ability_cooldown.cooling_down) tint(255, 50);
      image(images['rock'], 20, height - 100, 80, 80);
      tint(255, 255);
      this.ability_cooldown.show();
    }
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

        this.ability_cooldown.update();

      case 'pause':
        this.pause_modal.update();
        return;
    }
  }
}
