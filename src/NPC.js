class NPC {
  constructor(pos, image, size, on_interact) {
    this.pos = createVector(...pos);
    this.image = image;
    this.size = size;
    this.on_interact = on_interact;
    this.count = -1;
  }

  interact() {
    this.count++;
    return this.on_interact(this.count);
  }

  is_interactable(player_pos) {
    return this.pos.dist(createVector(...player_pos)) < this.size[0] * 1.5;
  }

  show(player_pos) {
    imageMode(CENTER);
    image(this.image, this.pos.x, this.pos.y, ...this.size);

    if (this.is_interactable(player_pos)) {
      // Interactable NPC
      rectMode(CENTER);
      strokeWeight(0);
      fill(255);
      rect(this.pos.x, this.pos.y - this.size[1], 250, 30);

      textAlign(CENTER, CENTER);
      textSize(25);
      fill(0);
      strokeWeight(3);
      stroke(0);
      text(
        'Press E to Interact',
        this.pos.x,
        this.pos.y - this.size[1] - 3,
        250,
        40
      );
    }
  }
}
