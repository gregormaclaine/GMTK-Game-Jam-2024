class AbilityCooldown {
  constructor(cooldown, color, run) {
    this.cooldown = cooldown; // Seconds
    this.color = color;
    this.run = run;

    this.pos = [20, height - 15];
    this.size = [80, 10];

    this.cooling_down = false;
    this.cooldown_progress = 0;
  }

  activate() {
    if (this.cooling_down) return;
    this.run();
    this.cooling_down = true;
    this.cooldown_progress = 0;
  }

  update() {
    if (this.cooling_down) {
      this.cooldown_progress += 1 / frameRate() / this.cooldown;
      if (this.cooldown_progress >= 1) this.cooling_down = false;
    }
  }

  show() {
    if (!this.cooling_down) return;

    rectMode(CORNER);
    stroke(0);
    strokeWeight(1);
    fill(200);
    rect(...this.pos, ...this.size);

    fill(this.color);
    const w = lerp(0, this.size[0], this.cooldown_progress);
    rect(...this.pos, w, this.size[1]);
  }
}
