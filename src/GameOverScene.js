class GameOverScene {
  constructor(return_to_menu) {
    this.main_menu_button = new JL.Button(
      'Go To World',
      [width / 2, height * 0.55, 400, 100],
      return_to_menu
    );
  }

  handle_click() {
    this.main_menu_button.handle_click();
  }

  show() {
    background(0);

    textSize(90);
    fill('white');
    textAlign(CENTER, CENTER);
    text('GAME OVER', width / 2, height * 0.4);

    fill(0);
    stroke(0);
    strokeWeight(3);
    this.main_menu_button.show();
  }

  update() {}
}
