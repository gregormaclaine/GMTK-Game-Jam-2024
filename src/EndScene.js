class EndScene {
  constructor({ collected, results, return_to_menu }) {
    this.collected = collected;
    this.results = results;

    this.main_menu_button = new JL.Button(
      'Main Menu',
      [width / 2, height * 0.55, 400, 100],
      return_to_menu
    );
  }

  handle_click() {
    this.main_menu_button.handle_click();
  }

  update() {}

  show() {
    imageMode(CORNER);
    background(images['bullet-bg']);
    textSize(90);
    fill('white');
    textAlign(CENTER, CENTER);
    text('Thanks For Playing', width / 2, height * 0.4);

    fill(0);
    stroke(0);
    strokeWeight(3);
    this.main_menu_button.show();
  }
}
