class Bullet {
  constructor(x, y, size = 200, speed = 5) {
    this.pos = createVector(x, y);
    this.size = size;
    this.speed = speed;
    this.hitbox = new HitBox(this.pos, [size, size]);
  }

  show() {
    // strokeWeight(0);
    // for (let i = 0; i < 5; i++) {
    //   fill(255, 0, 0, 100);
    //   circle(this.pos.x, this.pos.y - (5 - i) * 11, 5 + i * 3);
    // }

    imageMode('center');
    image(images['rock'], this.pos.x, this.pos.y, this.size, this.size);

    this.hitbox.show();
  }

  update() {
    this.pos.add(createVector(0, this.speed));
    this.hitbox.set_pos(this.pos);
  }
}

class BulletHell {
  constructor() {
    this.bullets = [];
  }

  // MAKE LOADS OF THESE FUNCTIONS STEPAN
  async spawn_bullets() {
    for (let i = 0; i < 120; i++) {
      // const x = width * 0.03 + (width * 0.94 * (i % 4)) / 3;
      const x = (random(1000) / 1000) * width * 0.94 + width * 0.03;
      this.bullets.push(new Bullet(x, -100));
      await timeout(250);
    }
  }

  handle_click() {
    this.spawn_bullets();
  }

  show() {
    for (const bullet of this.bullets) {
      bullet.show();
    }
  }

  update() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];

      if (bullet.y > height + 30) {
        this.bullets.splice(i, 1);
        continue;
      }

      bullet.update();
    }
  }
}
