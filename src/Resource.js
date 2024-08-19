class Resource {
  static ATTRACT_SPEED = 0.65;

  constructor({ pos, size, on_collect, image, remove, speed, sound }) {
    this.pos = pos;
    this.size = size || [60, 40];
    this.on_collect = on_collect;
    this.remove = remove;
    this.image = image;
    this.angle = 0;
    this.speed = speed || [0, 0];
    this.sound = sound;

    this.hitbox = new HitBox([this.pos.x, this.pos.y], this.size);
    this.collected = false;
    this.opacity = 1;
    this.spin_speed = random(0.005, 0.02);
    this.gone = false;
  }

  show() {
    if (this.gone) return;

    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    // rectMode(CENTER);
    // fill('white');
    // strokeWeight(0);
    // rect(0, 0, this.size, this.size);
    imageMode(CENTER);
    tint(255, this.opacity * 255);
    image(this.image, 0, 0, ...this.size);
    pop();

    this.hitbox.show();
  }

  update(player, attracted = false) {
    if (this.gone) return;

    if (this.collected) {
      this.opacity -= 0.15;
      if (this.opacity <= 0) return (this.gone = true);
    }

    this.angle += this.spin_speed;
    this.hitbox.set_angle(this.angle);

    if (this.hitbox.is_colliding(player.hitbox)) {
      this.collect();
    }

    const vel = createVector(...this.speed);
    if (attracted) {
      const magnetic_effect = player.pos.copy();
      magnetic_effect.sub(this.pos);
      magnetic_effect.setMag(Resource.ATTRACT_SPEED);
      vel.add(magnetic_effect);
    }
    vel.mult(60 / (frameRate() || 1));
    this.pos.add(vel);
    this.hitbox.set_pos([this.pos.x, this.pos.y]);
  }

  collect() {
    if (this.collected) return;
    this.collected = true;
    if (this.sound) audio.play_sound(this.sound);
    this.on_collect();
  }

  on_screen() {
    if (this.pos.x + this.size / 2 < 0 && this.speed[0] < 0) return false;
    if (this.pos.x - this.size / 2 > width && this.speed[0] > 0) return false;
    if (this.pos.y + this.size / 2 < 0 && this.speed[1] < 0) return false;
    if (this.pos.y - this.size / 2 > height && this.speed[1] > 0) return false;
    return true;
  }
}
