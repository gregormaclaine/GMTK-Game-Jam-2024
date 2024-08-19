class Bullet {
  constructor(x, y, size = 200, speed_x = 0, speed_y = 5) {
    this.pos = createVector(x, y);
    this.size = size;
    this.speed = [speed_x, speed_y];
    this.hitbox = new HitBox([this.pos.x, this.pos.y], this.hitbox_size());
    const rock_odds = random();
    if (rock_odds > 0.98) {
      this.image = images['cool-rock'];
    } else if (rock_odds > 0.94) {
      this.image = images['asteroid'];
    } else {
      this.image = images['rock'];
    }
    this.rotation = random(0, 2 * PI);
    this.has_collided = false;

    this.explosion_effect = new ParticleEffect(
      images['explosion'],
      size,
      0,
      0.3
    );
    this.exploded = false;
  }

  set_size(size) {
    this.size = size;
    this.hitbox.size = this.hitbox_size();
  }

  hitbox_size() {
    return [this.size * 0.7, this.size * 0.7];
  }

  show() {
    if (this.exploded) {
      this.explosion_effect.show(false, false, 'grow');
      return;
    }

    imageMode('center');
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    image(this.image, 0, 0, this.size, this.size);
    pop();
    this.hitbox.show();
  }

  update(slow = false) {
    if (this.exploded) {
      this.explosion_effect.update();
      return;
    }
    const vel = createVector(...this.speed);
    if (slow) vel.mult(0.25);
    vel.mult(60 / (frameRate() || 1));
    this.pos.add(vel);
    this.hitbox.set_pos([this.pos.x, this.pos.y]);
  }

  async collide() {
    // move hitbox off of screen to prevent extra collisions
    this.hitbox.set_pos([-100, -100]);
    this.exploded = true;
    await this.explosion_effect.trigger([this.pos.x, this.pos.y]);
    this.has_collided = true;
  }

  on_screen() {
    if (this.pos.x + this.size / 2 < 0 && this.speed[0] < 0) return false;
    if (this.pos.x - this.size / 2 > width && this.speed[0] > 0) return false;
    if (this.pos.y + this.size / 2 < 0 && this.speed[1] < 0) return false;
    if (this.pos.y - this.size / 2 > height && this.speed[1] > 0) return false;
    return true;
  }
}

class Lazer extends Bullet {
  constructor(x, y, speed_x, speed_y) {
    super(x, y, 0, speed_x, speed_y);
    this.length = 50;
    this.hitbox = new HitBox([this.pos.x, this.pos.y], [10, 10]);
  }

  show() {
    stroke('red');
    strokeWeight(6);
    const tail = createVector(...this.speed);
    tail.mult(-1);
    tail.setMag(this.length);
    tail.add(this.pos);
    line(this.pos.x, this.pos.y, tail.x, tail.y);
  }
}

class BulletHell {
  constructor({ player, collected, passives, dialogue }) {
    this.player = player;
    this.collected = collected;
    this.dialogue = dialogue;
    this.bullets = [];
    this.resources = [];
    this.lazers = [];
    this.slow = false;
    this.magnetic = passives.includes('magnet');
    this._done = false;
  }

  stop() {
    this._done = true;
  }

  is_done() {
    return this._done || this.player.health <= 0;
  }

  shoot() {
    const dir = this.player.vel.copy();
    dir.setMag(15);
    audio.play_sound('lazer.wav');
    this.lazers.push(
      new Lazer(this.player.pos.x, this.player.pos.y, dir.x, dir.y)
    );
  }

  // MAKE LOADS OF THESE FUNCTIONS STEPAN
  split_bullet(bullet, splittable = []) {
    //Creates 2 bullets at the location of the original one
    const x = bullet.pos.x;
    const y = bullet.pos.y;
    const b1 = new Bullet(x, y, bullet.size * 0.75, 2.5, bullet.speed.y);
    const b2 = new Bullet(x, y, bullet.size * 0.75, -2.5, bullet.speed.y);
    splittable.push(b1, b2);
    this.bullets.push(b1, b2);

    bullet.pos.y = height + 100;
  }

  async spawn_bullets(speed, size, delta, n) {
    for (let i = 0; i < n; i++) {
      // const x = width * 0.03 + (width * 0.94 * (i % 4)) / 3;
      const x = (random(1000) / 1000) * width * 0.94 + width * 0.03;
      this.bullets.push(new Bullet(x, -100, size, 0, speed));
      // const resource = new Resource();
      // this.resources.push(resource);
      // setTimeout(() => (resource.gone = true), 1000);

      // OR:
      // setTimeout(() => this.resources.forEach(r => (r.gone = true)), 1000);
      await timeout(delta);
    }
  }

  async pattern1() {
    //Makes the player zigzag
    for (let sets = 0; sets < 5; sets++) {
      for (let i = 0; i < 12; i++) {
        if (i % 4 != 0 && i % 4 != 3) {
          const x = (width / 12) * i;
          this.bullets.push(new Bullet(x, -100, 150));
        }
      }
      await timeout(1500);
      for (let j = 0; j < 12; j++) {
        if (j % 4 != 0 && j % 4 != 1) {
          const x = (width / 12) * j + 150;
          this.bullets.push(new Bullet(x, -100, 150));
        }
      }
      await timeout(1500);
    }
  }

  async pattern1andhalf(sets) {
    const sep = 20;
    const size = 150;

    for (let i = 0; i < sets; i++) {
      const right_side = random(size * 3 + sep * 2, width / 2);
      const left_side = random(width / 2, width - (size * 3 + sep * 2));

      this.bullets.push(
        new Bullet(right_side - size * 0.5, -100, size),
        new Bullet(right_side - size * 1.5 - sep, -100, size),
        new Bullet(right_side - size * 2.5 - sep * 2, -100, size),

        new Bullet(left_side + size * 0.5, -100, size),
        new Bullet(left_side + size * 1.5 + sep, -100, size),
        new Bullet(left_side + size * 2.5 + sep * 2, -100, size)
      );
      await timeout(3000);
    }
  }

  async pattern2() {
    //Spawns 'shotgun' blasts of asteroids from 5 alternating locations
    for (let sets = 0; sets < 5; sets++) {
      const x = (random(1000) / 1000) * width;
      for (let i = 0; i < 10; i++) {
        const theta = 0.2 * Math.PI * i;
        this.bullets.push(
          new Bullet(x, -100, 150, 5 * Math.cos(theta), 5 * Math.sin(theta))
        );
        await timeout(50);
      }
      await timeout(500);
    }
  }

  async pattern3() {
    //One slow moving asteroid which spawns smaller ones
    let spawner = new Bullet(width * 0.5, -100, 300);
    this.bullets.push(spawner);
    for (let i = 0; i < 20; i++) {
      const x = spawner.pos.x;
      const y = spawner.pos.y;
      this.bullets.push(new Bullet(x, y, 100, 5, 5));
      this.bullets.push(new Bullet(x, y, 100, -5, 5));
      await timeout(1500);
    }
  }

  async pattern4() {
    let spiral_pos;

    while (!spiral_pos || this.player.pos.dist(spiral_pos) < 300) {
      const spiral_x = (random(1000) / 1000) * width;
      const spiral_y = (random(1000) / 2300) * height;
      spiral_pos = createVector(spiral_x, spiral_y);
    }
    const { x: spiral_x, y: spiral_y } = spiral_pos;

    let spiral = new Bullet(spiral_x, spiral_y, 200, 0, 0);
    this.bullets.push(spiral);
    await timeout(1000);
    //spawn up
    for (let up = 1; up < 10; up++) {
      const x = spiral_x;
      const y = spiral_y - 150 * up;
      this.bullets.push(new Bullet(x, y, 100, up, 0));
      await timeout(100);
    }
    //spawn right
    for (let right = 1; right < 10; right++) {
      const x = spiral_x + 150 * right;
      const y = spiral_y;
      this.bullets.push(new Bullet(x, y, 100, 0, right));
      await timeout(100);
    }
    //spawn down
    for (let down = 1; down < 10; down++) {
      const x = spiral_x;
      const y = spiral_y + 150 * down;
      this.bullets.push(new Bullet(x, y, 100, -down, 0));
      await timeout(100);
    }
    //spawn left
    for (let left = 1; left < 10; left++) {
      const x = spiral_x - 150 * left;
      const y = spiral_y;
      this.bullets.push(new Bullet(x, y, 100, 0, -left));
      await timeout(100);
    }
    await timeout(6000);
    //Deletes the spawning asteroid after 6 seconds
    spiral.speed[1] = 6;
  }

  async pattern5() {
    //Asteroid pulsing in size
    for (let set = 0; set < 3; set++) {
      const x = random(width);
      let mode = 0;
      let astr = new Bullet(x, -200, 400, random(-0.5, 0.5), 3);
      this.bullets.push(astr);
      for (let i = 0; i < 300 && this.bullets.includes(astr); i++) {
        //Don't ask
        if (mode == 0) {
          if (astr.size >= 590) {
            mode = 1;
          } else {
            mode = 0;
          }
        } else if (mode == 1) {
          if (astr.size <= 290) {
            mode = 0;
          } else {
            mode = 1;
          }
        }
        if (mode === 0) {
          astr.size = astr.size + 10;
          astr.hitbox = new HitBox(
            [astr.pos.x, astr.pos.y],
            [astr.size * 0.7, astr.size * 0.7]
          );
        } else if (mode === 1) {
          astr.size = astr.size - 10;
          astr.hitbox = new HitBox(
            [astr.pos.x, astr.pos.y],
            [astr.size * 0.7, astr.size * 0.7]
          );
        }
        await timeout(25);
      }
    }
  }

  async pattern6() {
    let splittable = [];
    //Splitting these nuts
    for (let i = 0; i < 5; i++) {
      const x = 200 + (i * width) / 5;
      const b = new Bullet(x, -100, 200, 0, 3);
      splittable.push(b);
      this.bullets.push(b);
      if (i < 4) await timeout(random(200, 800));
    }
    await timeout(10);
    splittable.forEach(bullet => {
      this.split_bullet(bullet, splittable);
    });
    await timeout(2000);
    splittable.forEach(bullet => {
      this.split_bullet(bullet, splittable);
    });
    splittable = [];

    await timeout(1000);
    for (let i = 0; i < 5; i++) {
      const x = width - 200 - (i * width) / 5;
      const b = new Bullet(x, -100, 200);
      splittable.push(b);
      this.bullets.push(b);
      await timeout(random(1000));
    }
    await timeout(100);
    splittable.forEach(bullet => {
      this.split_bullet(bullet, splittable);
    });
    await timeout(2000);
    splittable.forEach(bullet => {
      this.split_bullet(bullet, splittable);
    });
  }

  rocket(x) {
    this.bullets.push(new Bullet(x, -100, 50));

    this.bullets.push(new Bullet(x + 50, -125, 50));
    this.bullets.push(new Bullet(x - 50, -125, 50));

    this.bullets.push(new Bullet(x + 100, -175, 50));
    this.bullets.push(new Bullet(x - 100, -175, 50));
    this.bullets.push(new Bullet(x, -175, 50));

    this.bullets.push(new Bullet(x + 25, -200, 50));
    this.bullets.push(new Bullet(x - 25, -200, 50));

    this.bullets.push(new Bullet(x, -225, 50));

    this.bullets.push(new Bullet(x + 150, -275, 50));
    this.bullets.push(new Bullet(x - 150, -275, 50));

    this.bullets.push(new Bullet(x + 200, -325, 50));
    this.bullets.push(new Bullet(x - 200, -325, 50));
    this.bullets.push(new Bullet(x + 150, -325, 50));
    this.bullets.push(new Bullet(x - 150, -325, 50));

    this.bullets.push(new Bullet(x + 225, -375, 50));
    this.bullets.push(new Bullet(x - 225, -375, 50));
    this.bullets.push(new Bullet(x + 150, -375, 50));
    this.bullets.push(new Bullet(x - 150, -375, 50));
    this.bullets.push(new Bullet(x + 100, -375, 50));
    this.bullets.push(new Bullet(x - 100, -375, 50));
    this.bullets.push(new Bullet(x + 50, -375, 50));
    this.bullets.push(new Bullet(x - 50, -375, 50));
    this.bullets.push(new Bullet(x, -375, 50));

    this.bullets.push(new Bullet(x + 50, -400, 50));
    this.bullets.push(new Bullet(x - 50, -400, 50));
    this.bullets.push(new Bullet(x, -400, 50));
    this.bullets.push(new Bullet(x + 50, -425, 50));
    this.bullets.push(new Bullet(x - 50, -425, 50));
    this.bullets.push(new Bullet(x, -425, 50));
    this.bullets.push(new Bullet(x + 50, -450, 50));
    this.bullets.push(new Bullet(x - 50, -450, 50));
    this.bullets.push(new Bullet(x, -450, 50));
  }
  async pattern7() {
    //Spawns rockets in 2 out of 3 thirds of the screen
    for (let set = 0; set < 5; set++) {
      const r_n = Math.floor(Math.random() * 3);
      // console.log(r_n);
      for (let i = 0; i < 3; i++) {
        if (i != r_n) {
          const x = 260 + (i * width) / 3;
          this.rocket(x);
        }
      }
      await timeout(2500);
    }
  }

  bounce(bullet) {
    //Checks if the bullet has reached either side of the screen and then changes the direction (assuming perfectly elastic collision)
    if (bullet.pos.x < 0 || bullet.pos.x > width) {
      bullet.speed[0] = -bullet.speed[0];
    }
  }

  async pattern8() {
    //Side to side bounce
    for (let i = 0; i < 6; i++) {
      const x = 150 + (i * (width / 10 + 100) * random(1000)) / 1000;
      this.bullets.push(new Bullet(x, -100, 120, (-1) ** (i + 1) * 7));
    }
    for (let t = 0; t < 50; t++) {
      this.bullets.forEach(bullet => {
        this.bounce(bullet);
      });
      await timeout(100);
    }
  }

  async pattern9() {
    //Just fast sniper rocks
    for (let i = 0; i < 20; i++) {
      const x = (random(1000) / 1000) * width * 0.94 + width * 0.03;
      this.bullets.push(new Bullet(x, -100, 75, 0, 20));
      await timeout(100);
    }
  }

  async spawn_resources() {
    for (let i = 0; i < 2; i++) {
      this.resources.push(
        new Resource({
          pos: createVector(
            (random(1000) / 1000) * width,
            (random(1000) / 1000) * height
          ),
          speed: [random(1.5), random(1.5)],
          image: images['gigantium'],
          on_collect: () => {
            this.collected.gigantium += Math.floor(random(5, 8));
            this.collected.size += 1;
            audio.play_sound('pickup_gigantium.wav');
          }
        })
      );
      await timeout(random(900));
    }
    for (let j = 0; j < 2; j++) {
      this.resources.push(
        new Resource({
          pos: createVector(random(1000), random(1000)),
          image: images['minimium'],
          speed: [random(1.5), random(1.5)],
          on_collect: () => {
            this.collected.minimium += Math.floor(random(5, 8));
            this.collected.size -= 1;
            audio.play_sound('pickup_minimium.wav');
          }
        })
      );
      await timeout(random(900));
    }
  }

  spawn_random_diag(other_side) {
    const vel = p5.Vector.fromAngle(random(PI / 8, (3 * PI) / 8), random(3, 7));
    if (other_side) vel.rotate(PI / 2);
    this.bullets.push(
      new Bullet(
        other_side
          ? width + random(50, 150)
          : -random(50, 150) - random(50, 150),
        -random(50, 150),
        80,
        vel.x,
        vel.y
      )
    );
  }

  async tutorial_level() {
    await timeout(2000);
    await this.pattern1andhalf(4);
    await timeout(2000);
    const resource = new Resource({
      pos: createVector(width - 200, 200),
      image: images['gigantium'],
      on_collect: () => {}
    });
    this.resources.push(resource);
    if (this.is_done()) return;
    await this.dialogue.send(DIALOGUE.LEVEL_1_RESOURCE_INTRO_1);
    await new Promise(resolve => {
      resource.on_collect = () => {
        this.collected.gigantium += Math.floor(random(5, 8));
        this.collected.size += 1;
        if (!this.is_done()) audio.play_sound('pickup_gigantium.wav');
        resolve();
      };
    });
    await timeout(1500);
    if (this.is_done()) return;
    await this.dialogue.send(DIALOGUE.LEVEL_1_RESOURCE_INTRO_2);
    await timeout(1500);

    for (let i = 0; i < 6; i++) {
      setTimeout(() => this.spawn_random_diag(), random(4000, 25000));
      setTimeout(() => this.spawn_random_diag(true), random(4000, 25000));
    }
    setTimeout(() => this.spawn_resources(), random(4000, 8000));
    await this.pattern1andhalf(9);
    await timeout(3000);
    if (this.is_done()) return;
    await this.dialogue.send(DIALOGUE.LEVEL_1_RESOURCE_INTRO_3);
  }

  async level1() {
    //level4_stepan
    for (let set = 0; set < 2; set++) {
      setTimeout(() => this.spawn_resources(), random(5000, 10000));
      setTimeout(() => this.spawn_resources(), random(18000, 30000));
      this.spawn_bullets(4, 100, 200, 200);
      for (let i = 0; i < 2; i++) {
        await this.pattern5();
      }
      await timeout(1000);
    }
    await timeout(5000);
  }

  async level2() {
    setTimeout(() => this.spawn_resources(), random(5000, 10000));
    setTimeout(() => this.spawn_resources(), random(18000, 30000));
    for (let set = 0; set < 3; set++) {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => this.spawn_random_diag(), random(500, 80000));
        setTimeout(() => this.spawn_random_diag(true), random(500, 8000));
      }
      setTimeout(() => this.pattern5(), random(1000, 4000));
      await this.pattern1();
      await timeout(1000);
    }
    await this.pattern2();
    await timeout(4500);
  }

  async level3() {
    //level5_stepan
    this.spawn_resources();
    await this.pattern1();
    await this.pattern1();
    await this.pattern7();
    await timeout(3000);
    this.spawn_resources();
    this.pattern4();
    await timeout(1000);
    this.pattern4();
    await timeout(1000);
    this.spawn_resources();
    this.pattern4();
    await timeout(1000);
    this.pattern2();
    // extras from gregor
    await timeout(4000);
    await this.pattern2();
    await timeout(5000);
  }

  async level4() {
    setTimeout(() => this.spawn_resources(), 1000);
    await this.pattern1();
    await timeout(1000);
    for (let p3 = 0; p3 < 5; p3++) {
      this.pattern3();
      await timeout(2000);
    }
    this.spawn_resources();
    for (let p0 = 0; p0 < 5; p0++) {
      await this.spawn_bullets(5, 150, 500);
    }
    await timeout(1000);
    await this.pattern1();
    await timeout(500);
    this.spawn_resources();
    for (let p0 = 0; p0 < 3; p0++) {
      await this.spawn_bullets(5, 150, 300);
    }
    await timeout(4000);
  }

  async level5() {
    for (let big_set = 0; big_set < 2; big_set++) {
      setTimeout(() => this.spawn_resources(), random(5000, 10000));
      setTimeout(() => this.spawn_resources(), random(18000, 30000));
      for (let set = 0; set < 3; set++) {
        await this.pattern2();
      }
      await timeout(2000);

      for (let set = 0; set < 6; set++) {
        setTimeout(() => this.pattern8(), 1400 * set);
      }
      await timeout(6 * 1400);

      for (let set = 0; set < 3; set++) {
        await this.pattern2();
      }
      await timeout(3000);
    }
    await timeout(2000);
  }

  async level6() {
    setTimeout(() => this.spawn_resources(), random(2000, 3500));
    for (let set = 0; set < 3; set++) {
      this.spawn_resources();
      await this.spawn_bullets(6, 100, 300, 60);

      this.pattern2();
    }
    this.spawn_resources();
    for (let p3 = 0; p3 < 3; p3++) {
      this.pattern3();
      await timeout(2000);
    }
    this.spawn_resources();
    await this.pattern2();
    await timeout(1000);
    this.spawn_resources();
    this.pattern2();
    this.spawn_resources();
    await this.pattern1();
    await timeout(3000);
  }

  async level7() {
    await this.dialogue.send(DIALOGUE.INTRODUCE_SPLITTING_ROCKS);
    for (let big_set = 0; big_set < 2; big_set++) {
      setTimeout(() => this.spawn_resources(), random(5000, 10000));
      setTimeout(() => this.spawn_resources(), random(18000, 30000));
      for (let set = 0; set < 3; set++) {
        for (let i = 0; i < 6; i++) {
          setTimeout(() => this.spawn_random_diag(), random(500, 80000));
          setTimeout(() => this.spawn_random_diag(true), random(500, 8000));
        }
        await this.pattern6();
        await timeout(1000);
      }
      await this.pattern2();
      await timeout(3500);
    }
    await timeout(1000);
  }

  async level8() {
    for (let set = 0; set < 2; set++) {
      setTimeout(() => this.spawn_resources(), random(5000, 10000));
      setTimeout(() => this.spawn_resources(), random(18000, 30000));
      for (let p0 = 0; p0 < 2; p0++) {
        await this.pattern4();
        await this.pattern4();
        this.spawn_bullets(2, 100, 400, 10);
        await timeout(2000);
      }
      await timeout(4000);
      this.pattern2();
      setTimeout(() => this.pattern2(), 3500);
      await this.pattern1();
      timeout(1000);
      await this.pattern2();
      await timeout(2000);
    }
    await timeout(2000);
  }

  // async level9() {
  //   //level6_stepan
  //   await this.spawn_resources();
  //   await this.pattern6();
  //   await timeout(3000);
  //   await this.spawn_resources();
  //   await this.pattern6();
  //   await timeout(3000);
  //   await this.spawn_resources();
  //   await this.pattern6();
  //   await timeout(3000);
  //   await this.pattern6();
  //   await this.spawn_resources();
  //   await this.pattern2();
  //   await this.pattern7();
  // }

  handle_click() {}

  show() {
    this.resources.forEach(r => r.show());
    for (const bullet of this.bullets) {
      bullet.show();
    }
    this.lazers.forEach(l => l.show());
  }

  update() {
    this.resources.forEach(r => r.update(this.player, this.magnetic));
    this.resources = this.resources.filter(r => !r.gone && r.on_screen());
    this.lazers.forEach(l => {
      l.update();
      this.bullets.forEach(b => {
        if (b.hitbox.is_colliding(l.hitbox)) {
          l.has_collided = true;
          b.collide();
          audio.play_sound('asteroid_explode.wav');
        }
      });
    });
    this.bullets.forEach(b => b.update(this.slow));
    this.lazers = this.lazers.filter(l => l.on_screen() && !l.has_collided);
    this.bullets = this.bullets.filter(b => b.on_screen() && !b.has_collided);
  }
}
``;
