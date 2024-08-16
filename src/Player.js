class Player {
  constructor({ start_pos, max_vel = 6, acceleration = 0.3, damping = 0.02 }) {
    this.pos = createVector(...start_pos);
    this.vel = createVector(0, 0);
    this.max_vel = max_vel;
    this.acceleration = acceleration;
    this.damping = damping;

    this.image = images['fish'];
    this.size = [200, 50];

    this.hitbox = new HitBox(this.pos, this.size);
  }

  force_on_screen() {
    const size = this.size;
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

  update() {
    const acc = createVector(
      (keyIsDown(68) - keyIsDown(65)) * this.acceleration,
      (keyIsDown(83) - keyIsDown(87)) * this.acceleration
    );

    if (acc.x === 0 && acc.y === 0) this.vel.mult(1 - this.damping);

    this.vel.add(acc);
    this.vel.limit(this.max_vel);
    this.pos.add(this.vel);
    this.force_on_screen();
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);

    imageMode(CENTER);
    image(this.image, 0, 0, ...this.size);
    pop();

    this.hitbox.show();
  }
}
