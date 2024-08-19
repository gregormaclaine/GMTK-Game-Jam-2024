class ParticleEffect {
  constructor(image, start_size = 100, distance = 90, duration = 1) {
    this.image = image;
    this.image.resize(start_size, 0);
    this.size = [this.image.width, this.image.height];
    this.distance = distance;
    this.duration = duration;

    this.pos = [-100, -100];

    this.showing = false;
    this.progress = 0;
    this.end_effect = () => {};
  }

  async trigger(pos) {
    this.showing = true;
    this.progress = 0;
    this.pos = pos;
    await new Promise(resolve => (this.end_effect = resolve));
    this.showing = false;
  }

  show(fade = true, spin = true, scale = 'shrink') {
    // const y_offset = lerp(0, this.distance, this.progress);
    const y_offset = -30;
    push();
    imageMode(CENTER);
    if (fade) tint(255, lerp(255, 0, this.progress));
    translate(this.pos[0], this.pos[1] - y_offset);
    if (spin) rotate(lerp(0, 2 * PI, this.progress));

    let scaler = x => x;
    if (scale === 'shrink') {
      scaler = x => x * lerp(1, 0.1, this.progress);
    } else if (scale === 'grow') {
      scaler = x => x * lerp(0.2, 1.5, this.progress);
    }

    image(this.image, 0, 0, ...this.size.map(scaler));
    pop();
  }

  update() {
    this.progress += 1 / frameRate() / this.duration;
    if (this.progress >= 1) {
      this.end_effect();
    }
  }
}
