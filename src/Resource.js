class Resource {
  constructor({ pos, size, on_collect, image, remove, speed }) {
    this.pos = pos;
    this.size = size || [60, 40];
    this.on_collect = on_collect;
    this.remove = remove;
    this.image = image;
    this.angle = 0;
    this.speed = speed || [0, 0];

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

  update(player) {
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
  }

  collect() {
    if (this.collected) return;
    this.collected = true;
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
