class Player {
  constructor({
    start_pos,
    collected,
    max_vel = 10,
    acceleration = 0.3,
    damping = 0.02
  }) {
    this.pos = createVector(...start_pos);
    this.collected = collected;
    this.vel = createVector(0, 0);
    this.max_vel = max_vel;
    this.acceleration = acceleration;
    this.damping = damping;

    this.image = images['plane'];
    this.size = [100, 100];

    this.hitbox = new HitBox();
    this.update_hitbox();
  }

  update_hitbox() {
    this.hitbox.set_pos([this.pos.x, this.pos.y]);
    this.hitbox.set_angle(this.vel.heading());
    const growth = 1.2 ** this.size_factor;
    this.hitbox.size = [
      this.size[0] * 0.9 * growth,
      this.size[1] * 0.6 * growth
    ];
  }

  force_on_screen() {
    const growth = 1.2 ** this.size_factor;
    const size = [this.size[0] * growth, this.size[1] * growth];
    if (this.pos.x + size[0] / 2 > width) {
      this.pos.x = width - size[0] / 2;
      this.vel.setMag(0.001);
    }

    if (this.pos.x - size[0] / 2 < 0) {
      this.pos.x = size[0] / 2;
      this.vel.setMag(0.001);
    }

    if (this.pos.y + size[1] / 2 > height) {
      this.pos.y = height - size[1] / 2;
      this.vel.setMag(0.001);
    }

    if (this.pos.y - size[1] / 2 < 0) {
      this.pos.y = size[1] / 2;
      this.vel.setMag(0.001);
    }
  }

  get size_factor() {
    return this.collected.size;
  }

  update() {
    const acc = createVector(
      keyIsDown(68) - keyIsDown(65),
      keyIsDown(83) - keyIsDown(87)
    );
    acc.setMag(this.acceleration * 1.5 ** this.size_factor);

    if (acc.x === 0 && acc.y === 0)
      this.vel.mult(1 - this.damping * 1.3 ** this.size_factor);

    this.vel.add(acc);
    this.vel.limit(this.max_vel);
    this.pos.add(this.vel);
    this.force_on_screen();
    this.update_hitbox();
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);

    rotate(this.vel.heading());

    imageMode(CENTER);
    const growth = 1.2 ** this.size_factor;
    image(this.image, 0, 0, this.size[0] * growth, this.size[1] * growth);
    pop();

    this.hitbox.show();
  }
}
