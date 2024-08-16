class MenuScreen {
  constructor(images, dialogue, start_game) {
    this.images = images;
    this.dialogue = dialogue;
    this.start_game = start_game;

    this.in_credits = false;
    this.credits = new JL.Credits(CREDITS);

    this.start_rect = [width * 0.5, height * 0.5, 450, 75];
    this.credits_rect = [width * 0.5, height * 0.7, 450, 75];
  }

  handle_click() {
    if (this.in_credits) this.credits.handle_click();

    if (this.mouse_over_rect(this.start_rect)) this.start_game();
    else if (this.mouse_over_rect(this.credits_rect)) {
      this.in_credits = true;
      this.credits.start().then(() => (this.in_credits = false));
    }
  }

  mouse_over_rect(rect) {
    const [x, y, w, h] = rect;
    if (mouseX < x - w / 2) return false;
    if (mouseX > x + w / 2) return false;
    if (mouseY < y - h / 2) return false;
    if (mouseY > y + h / 2) return false;
    return true;
  }

  show() {
    if (this.in_credits) return this.credits.show();

    background(200);
    imageMode(CORNER);
    image(this.images['menu-bg'], 0, 0, 800, 600);

    imageMode(CENTER);
    image(this.images['start-button'], ...this.start_rect);
    image(this.images['credits-button'], ...this.credits_rect);

    textSize(40);
    textAlign(CENTER, CENTER);
    stroke(0);
    strokeWeight(0);
    fill(0);
    text('Title', width * 0.5, height * 0.3);
  }

  update() {
    if (
      this.mouse_over_rect(this.credits_rect) ||
      this.mouse_over_rect(this.start_rect)
    )
      cursor('pointer');
  }
}
