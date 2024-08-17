class Bullet {
  constructor(x, y, size = 200, speed_x = 0, speed_y = 5) {
    this.pos = createVector(x, y);
    this.size = size;
    this.speed = [speed_x, speed_y];
    this.hitbox = new HitBox(
      [this.pos.x, this.pos.y],
      [size * 0.7, size * 0.7]
    );
    this.image = random() > 0.96 ? images['asteroid'] : images['rock'];
    this.has_collided = false;
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

  collide() {
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

class BulletHell {
  constructor({ player, collected }) {
    this.player = player;
    this.bullets = [];
    this.collected = collected;

    this.resources = [
      // new Resource({
      //   pos: createVector(200, 1000),
      //   image: images['gigantium'],
      //   on_collect: () => {
      //     this.collected.gigantium += Math.floor(random(5, 8));
      //     this.collected.size += 0.5;
      //   }
      // }),
    ];
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

  async spawn_bullets(speed, size, delta) {
    for (let i = 0; i < 10; i++) {
      // const x = width * 0.03 + (width * 0.94 * (i % 4)) / 3;
      const x = (random(1000) / 1000) * width * 0.94 + width * 0.03;
      this.bullets.push(new Bullet(x, -100, size, 0, speed));
      await timeout(delta);
    }
  }

  async pattern1() {
    //Makes the player zigzag
    for (let sets = 0; sets < 5; sets++) {
      for (let i = 0; i < 10; i++) {
        if (i % 4 != 0 && i%4!=1) {
          const x = (width / 10) * i;
          this.bullets.push(new Bullet(x, -100, 150));
        }
      }
      await timeout(1500);
      for (let j = 0; j < 10; j++) {
        if (j % 4 != 0 && j%4!=1) {
          const x = (width / 10) * j + 150;
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
          new Bullet(x, -100, 150, 5 * Math.cos(theta), 5 * Math.sin(theta))
        );
        await timeout(50)
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
      await timeout(50);
    }
    //spawn right
    for (let right = 1; right < 10; right++) {
      const x = spiral_x + 150 * right;
      const y = spiral_y;
      this.bullets.push(new Bullet(x, y, 100, 0, right));
      await timeout(50);
    }
    //spawn down
    for (let down = 1; down < 10; down++) {
      const x = spiral_x;
      const y = spiral_y + 150 * down;
      this.bullets.push(new Bullet(x, y, 100, -down, 0));
      await timeout(50);
    }
    //spawn left
    for (let left = 1; left < 10; left++) {
      const x = spiral_x - 150 * left;
      const y = spiral_y;
      this.bullets.push(new Bullet(x, y, 100, 0, -left));
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
    //Spawns rockets in 2 out of 3 thirds of the screen
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
      this.bullets.push(new Bullet(x, -100, 150, (-1) ** (i + 1) * 10));
    }
    for (let t = 0; t < 500; t++) {
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

  async spawn_resources(){
    for (let i =0;i<random(2)+1;i++){
      this.resources.push(new Resource({
        pos: createVector(random(1000)/1000*width, random(1000)/1000*height),
        image: images['gigantium'],
        on_collect: () => {
        this.collected.gigantium += Math.floor(random(5, 8));
        this.collected.size += 0.5;}}))
    }
    for (let j=0;j<random(random(2)+1);j++){
      this.resources.push(new Resource({
        pos: createVector(random(1000), random(1000)),
        image: images['minimium'],
        on_collect: () => {
        this.collected.minimium += Math.floor(random(5, 8));
        this.collected.size -= 0.5;}}))
    }
  }

  async level1() {
    await this.spawn_resources()
    await this.pattern1();
    await timeout(1000);
    for (let p3=0; p3<5;p3++){
      this.pattern3();
      await timeout(2000);
    }
    await this.spawn_resources()
    for (let p0 = 0;p0<5;p0++){
      await this.spawn_bullets(5, 150, 500);
    }
    await timeout(1000);
    await this.pattern1();
    for (let p0 = 0;p0<3;p0++){
      await this.spawn_bullets(5, 150, 300);
    }
    await this.spawn_resources()
  }

  async level2(){
    for (let set = 0;set<3;set++){
    for (let p0 = 0;p0<6;p0++){
      await this.spawn_bullets(7, 100, 200);
    }
    this.pattern2();
  }
  for (let p3=0; p3<3;p3++){
    this.pattern3();
    await timeout(2000);
  }
    this.pattern2()
    await timeout(1000);
    await this.pattern1();
    this.pattern2();
  }
  async level3(){
    for (let set = 0;set <2; set++){
    for (let p0 = 0;p0<2;p0++){
      this.pattern4()
      await this.spawn_bullets(2, 100, 250);
      await timeout(1000)
    }
    await timeout(6000)
    await this.pattern1()
    this.pattern2()
    await timeout(1000)
  }
}

  handle_click() {
    this.level1();
  }

  show() {
    this.resources.forEach(r => r.show());
    for (const bullet of this.bullets) {
      bullet.show();
    }
  }

  update() {
    this.resources.forEach(r => r.update(this.player));
    this.resources = this.resources.filter(r => !r.gone && r.on_screen());
    this.bullets.forEach(b => b.update());
    this.bullets = this.bullets.filter(b => b.on_screen() && !b.has_collided);
  }
}
