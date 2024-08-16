class PauseModal {
  constructor() {
    this.end_callback = () => {};

    this.close_button = new JL.Button(
      'X',
      [width * 0.85, height * 0.17, 60, 60, 15],
      () => this.end_callback()
    );
  }

  open(end_callback) {
    this.end_callback = end_callback;
  }

  handle_key_press() {
    if (keyCode === PAUSE_KEY_CODE) this.end_callback();
  }

  handle_click() {
    this.close_button.handle_click();
  }

  update() {}

  show() {
    rectMode(CENTER);
    fill(0, 0, 139, 200);
    strokeWeight(0);
    rect(width / 2, height / 2, width * 0.8, height * 0.8, 20);

    textAlign(CENTER, CENTER);
    fill(255);
    textSize(40);
    text('Game Paused', width / 2, height * 0.45);

    this.close_button.show();
  }
}
