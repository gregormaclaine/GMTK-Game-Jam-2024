class Bullet {
  constructor(x, y, size = 200, speed_x = 0, speed_y = 5) {
    this.pos = createVector(x, y);
    this.size = size;
    this.speed = [speed_x, speed_y];
    this.hitbox = new HitBox(
      [this.pos.x, this.pos.y],
      [size * 0.9, size * 0.9]
    );
    this.image = random() > 0.96 ? images['asteroid'] : images['rock'];
  }

  show() {
    // strokeWeight(0);
    // for (let i = 0; i < 5; i++) {
    //   fill(255, 0, 0, 100);
    //   circle(this.pos.x, this.pos.y - (5 - i) * 11, 5 + i * 3);
    // }

    imageMode('center');
    image(this.image, this.pos.x, this.pos.y, this.size, this.size);

    this.hitbox.show();
  }

  update() {
    this.pos.add(createVector(...this.speed));
    this.hitbox.set_pos([this.pos.x, this.pos.y]);
  }

  on_screen() {
    if (this.pos.x + this.size / 2 < 0 && this.speed[0] < 0) return false;
    if (this.pos.x - this.size / 2 > width && this.speed[0] > 0) return false;
    if (this.pos.y + this.size / 2 < 0 && this.speed[1] < 0) return false;
    if (this.pos.y - this.size / 2 > height && this.speed[1] > 0) return false;
    return true;
  }
}

class BulletHell {
  constructor() {
    this.bullets = [];
  }

  // MAKE LOADS OF THESE FUNCTIONS STEPAN
  split_bullet(bullet) {
    //Creates 2 bullets at the location of the original one
    const x = bullet.pos.x;
    const y = bullet.pos.y;
    this.bullets.push(
      new Bullet(x, y, bullet.size * 0.75, 2.5, bullet.speed.y)
    );
    this.bullets.push(
      new Bullet(x, y, bullet.size * 0.75, -2.5, bullet.speed.y)
    );
    bullet.pos.y = height + 100;
  }

  async spawn_bullets() {
    for (let i = 0; i < 5; i++) {
      // const x = width * 0.03 + (width * 0.94 * (i % 4)) / 3;
      const x = (random(1000) / 1000) * width * 0.94 + width * 0.03;
      this.bullets.push(new Bullet(x, -100));
      await timeout(250);
    }
    this.bullets.forEach(bullet => {
      this.split_bullet(bullet);
    });
  }

  async pattern1() {
    //Makes the player zigzag
    for (let setsdd = 0; setsdd < 10; setsdd++) {
      for (let i = 0; i < 10; i++) {
        if (i % 4 != 0) {
          const x = (width / 10) * i;
          this.bullets.push(new Bullet(x, -100, 150));
        }
      }
      await timeout(1500);
      for (let j = 0; j < 10; j++) {
        if (j % 4 != 0) {
          const x = (width / 10) * j + 150;
          this.bullets.push(new Bullet(x, -100, 150));
        }
      }
      await timeout(1500);
      for (let k = 0; k < 10; k++) {
        if (k % 4 != 0) {
          const x = (width / 10) * k + 300;
          this.bullets.push(new Bullet(x, -100, 150));
        }
      }
      await timeout(1500);
    }
  }

  async pattern2() {
    //Spawns 'shotgun' blasts of asteroids from 5 alternating locations
    for (let sets = 0; sets < 5; sets++) {
      const x = (random(1000) / 1000) * width;
      for (let i = 0; i < 10; i++) {
        const theta = 0.2 * Math.PI * i;
        this.bullets.push(
          new Bullet(x, -100, 200, 10 * Math.cos(theta), 10 * Math.sin(theta))
        );
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
      this.bullets.push(new Bullet(x, y, 150, 5, 5));
      this.bullets.push(new Bullet(x, y, 150, -5, 5));
      await timeout(1000);
    }
  }

  async pattern4() {
    //Starts a spiral at a random point
    const spiral_x = (random(1000) / 1000) * width;
    const spiral_y = (random(1000) / 2300) * height;
    let spiral = new Bullet(spiral_x, spiral_y, 200, 0, 0);
    this.bullets.push(spiral);
    await timeout(1000);
    //spawn up
    for (let up = 1; up < 10; up++) {
      const x = spiral_x;
      const y = spiral_y - 150 * up;
      this.bullets.push(new Bullet(x, y, 150, up, 0));
      await timeout(50);
    }
    //spawn right
    for (let right = 1; right < 10; right++) {
      const x = spiral_x + 150 * right;
      const y = spiral_y;
      this.bullets.push(new Bullet(x, y, 150, 0, right));
      await timeout(50);
    }
    //spawn down
    for (let down = 1; down < 10; down++) {
      const x = spiral_x;
      const y = spiral_y + 150 * down;
      this.bullets.push(new Bullet(x, y, 150, -down, 0));
      await timeout(50);
    }
    //spawn left
    for (let left = 1; left < 10; left++) {
      const x = spiral_x - 150 * left;
      const y = spiral_y;
      this.bullets.push(new Bullet(x, y, 150, 0, -left));
      await timeout(50);
    }
    await timeout(6000);
    //Deletes the spawning asteroid after 6 seconds
    spiral.speed[1] = 6;
  }

  async pattern5() {
    //Asteroid pulsing in size
    for (let set = 0; set < 3; set++) {
      const x = (random(1000) / 1000) * width;
      let mode = 0;
      let astr = new Bullet(x, -100, 400, 0, 3);
      this.bullets.push(astr);
      for (let i = 0; i < 300; i++) {
        //Don't ask
        if (mode == 0) {
          if (astr.size == 590) {
            mode = 1;
          } else {
            mode = 0;
          }
        } else if (mode == 1) {
          if (astr.size == 290) {
            mode = 0;
          } else {
            mode = 1;
          }
        }
        if (mode === 0) {
          astr.size = astr.size + 10;
        } else if (mode === 1) {
          astr.size = astr.size - 10;
        }
        await timeout(25);
      }
    }
  }

  async pattern6() {
    //Splitting these nuts
    for (let i = 0; i < 5; i++) {
      const x = 200 + (i * width) / 5;
      this.bullets.push(new Bullet(x, -100, 200));
      await timeout(random(1000));
    }
    await timeout(100);
    this.bullets.forEach(bullet => {
      this.split_bullet(bullet);
    });
    await timeout(1000);
    this.bullets.forEach(bullet => {
      this.split_bullet(bullet);
    });
    await timeout(1000);
    for (let i = 0; i < 5; i++) {
      const x = width - 200 - (i * width) / 5;
      this.bullets.push(new Bullet(x, -100, 200));
      await timeout(random(1000));
    }
    await timeout(100);
    this.bullets.forEach(bullet => {
      this.split_bullet(bullet);
    });
    await timeout(1000);
    this.bullets.forEach(bullet => {
      this.split_bullet(bullet);
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
    //I dont know, im kinda tired tho
    for (let set = 0; set < 5; set++) {
      const r_n = Math.floor(Math.random() * 3);
      console.log(r_n);
      for (let i = 0; i < 3; i++) {
        if (i != r_n) {
          const x = 260 + (i * width) / 3;
          this.rocket(x);
        }
      }
      await timeout(2000);
    }
  }

  handle_click() {
    this.pattern4();
  }

  show() {
    for (const bullet of this.bullets) {
      bullet.show();
    }
  }

  update() {
    this.bullets.forEach(b => b.update());
    this.bullets = this.bullets.filter(b => b.on_screen());
  }
}
