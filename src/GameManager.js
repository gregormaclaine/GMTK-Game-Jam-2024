class GameManager {
  static SKYSPEED = 1;

  constructor({ images, audio, dialogue, collected }) {
    this.images = images;
    this.audio = audio;
    this.collected = collected;
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
    this.passives = [];
    this.reset();
  }

  reset() {
    this.sky_pos = 0;
    this.state = 'game';
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
      collected: this.collected,
      passives: this.passives,
      dialogue: this.dialogue
    });
  }

  async run_level(level) {
    this.level_promise = new Promise(
      resolve => (this.on_finish_level = resolve)
    );

    this.reset();

    await timeout(1000);
    switch (level) {
      case 'tutorial':
        this.audio.play_track('hell-3.mp3', true);
        await this.bullets.tutorial_level();
        break;
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
      this.player.ascending = true;
      await new Promise(resolve => (this.player.on_ascended = resolve));
      this.on_finish_level();
    }
  }

  set_ability(ability) {
    this.audio.play_sound('ability.wav');
    this.ability = ability;
    switch (this.ability) {
      case 'lazer':
        this.ability_cooldown.cooldown = 2;
        break;
      case 'stealth':
        this.ability_cooldown.cooldown = 10;
        break;
      case 'time':
        this.ability_cooldown.cooldown = 9;
        break;
    }
  }

  add_passive(passive) {
    this.audio.play_sound('ability.wav');
    this.passives.push(passive);
  }

  use_ability() {
    switch (this.ability) {
      case 'lazer':
        this.bullets.shoot();
        break;
      case 'stealth':
        this.audio.play_sound('invincibility_start.wav');
        this.player.invincible = true;
        setTimeout(() => {
          this.player.invincible = false;
          this.audio.play_sound('invincibility_end.wav');
        }, 2000);
        break;
      case 'time':
        this.bullets.slow = true;
        this.audio.play_sound('time_slowdown.wav');
        setTimeout(() => {
          this.bullets.slow = false;
          this.audio.play_sound('time_speedup.wav');
        }, 3500);
        break;
      // case 'magnet':
      //   this.bullets.magnetic = true;
      //   setTimeout(() => {
      //     this.bullets.magnetic = false;
      //   }, 3000);
      //   break;
      default:
        return;
    }
  }

  ability_image() {
    switch (this.ability) {
      case 'time':
        return images['ability-clock'];
      case 'stealth':
        return images['ability-shield'];
      case 'lazer':
        return images['ability-lazer'];
      default:
        return images['rock'];
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
      image(this.ability_image(), 20, height - 100, 80, 80);
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
