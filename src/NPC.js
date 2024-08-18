class NPC {
  constructor({
    pos,
    image,
    size,
    interact,
    text,
    text_width = 280,
    text_side = 'top',
    radius = 1.5,
    max_interactions
  }) {
    this.pos = createVector(...pos);
    this.image = image;
    this.size = size;
    this.on_interact = interact;
    this.text = text || 'Press E to Interact';
    this.text_width = text_width;
    this.max_interactions = max_interactions || 10000000;
    this.radius = radius;
    this.text_side = text_side;
    this.count = -1;
  }

  is_hidden() {
    return this.count + 1 >= this.max_interactions;
  }

  interact() {
    if (this.is_hidden()) return;
    this.count++;
    return this.on_interact(this.count, () => (this.count = 0));
  }

  is_interactable(player_pos) {
    if (this.is_hidden()) return false;
    return (
      this.pos.dist(createVector(...player_pos)) < this.size[0] * this.radius
    );
  }

  show(player_pos) {
    if (this.is_hidden()) return;

    imageMode(CENTER);
    image(this.image, this.pos.x, this.pos.y, ...this.size);

    if (this.is_interactable(player_pos)) {
      // Interactable NPC
      rectMode(CENTER);
      strokeWeight(0);
      fill(255);
      const rect_y =
        this.text_side === 'top'
          ? this.pos.y - this.size[1] / 2 - 20
          : this.pos.y + this.size[1] / 2 + 20;
      rect(this.pos.x, rect_y, this.text_width, 30);

      textAlign(CENTER, CENTER);
      textSize(20);
      fill(0);
      const text_y = rect_y - 3;
      text(this.text, this.pos.x, text_y, this.text_width, 80);
    }
  }
}
