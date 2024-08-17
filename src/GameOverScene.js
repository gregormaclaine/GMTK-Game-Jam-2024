class GameOverScene {
  constructor(return_to_menu) {
    this.back_button = new JL.Button(
      'Return to World',
      [width / 2, height * 0.55, 400, 100],
      return_to_menu
    );
  }

  handle_click() {
    this.back_button.handle_click();
  }

  show() {
    background(0);

    textSize(90);
    fill('white');
    textAlign(CENTER, CENTER);
    text('MISSION FAILED', width / 2, height * 0.4);

    fill(0);
    stroke(0);
    strokeWeight(3);
    this.back_button.show();
  }

  update() {}
}
