class MenuScreen {
  static SKYSPEED = 0.4;

  constructor(images, dialogue, start_game) {
    this.images = images;
    this.dialogue = dialogue;
    this.start_game = start_game;

    this.in_credits = false;
    this.credits = new JL.Credits(CREDITS);

    this.start_rect = [
      width * 0.5,
      height * 0.5,
      450,
      (450 / images['start-button'].width) * images['start-button'].height
    ];
    this.credits_rect = [
      width * 0.5,
      height * 0.7,
      450,
      (450 / images['credits-button'].width) * images['credits-button'].height
    ];

    this.sky_pos = 0;
    this.background = images['bullet-bg'];

    this.cat_angle = 0;
  }

  handle_click() {
    if (this.in_credits) return this.credits.handle_click();

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

    imageMode(CORNER);
    image(this.background, 0, this.sky_pos - this.background.height);
    image(this.background, 0, this.sky_pos);

    imageMode(CENTER);
    image(this.images['start-button'], ...this.start_rect);
    image(this.images['credits-button'], ...this.credits_rect);

    textSize(60);
    textAlign(CENTER, CENTER);
    strokeWeight(0);
    fill(255);
    textFont(fonts['bold']);
    text('You are spaceship cat!', width * 0.5, height * 0.3);
    textFont(fonts['regular']);

    imageMode(CENTER);
    push();
    translate(150, 150);
    rotate(this.cat_angle);
    image(images['cat-profile'], 0, 0, 120, 120);
    pop();

    push();
    translate(width - 150, 150);
    rotate(-this.cat_angle);
    image(images['cat-profile'], 0, 0, 120, 120);
    pop();

    imageMode(CENTER);
    push();
    translate(150, height - 150);
    rotate(-this.cat_angle);
    image(images['cat-profile'], 0, 0, 120, 120);
    pop();

    push();
    translate(width - 150, height - 150);
    rotate(this.cat_angle);
    image(images['cat-profile'], 0, 0, 120, 120);
    pop();
  }

  update() {
    if (this.in_credits) return;

    this.sky_pos =
      (this.sky_pos + MenuScreen.SKYSPEED) % this.background.height;

    this.cat_angle += 0.01;

    if (
      this.mouse_over_rect(this.credits_rect) ||
      this.mouse_over_rect(this.start_rect)
    )
      cursor('pointer');
  }
}
