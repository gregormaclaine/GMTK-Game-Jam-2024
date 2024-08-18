class EndScene {
  constructor({ collected, results, return_to_menu, dialogue }) {
    this.collected = collected;
    this.results = results;
    this.dialogue;

    this.main_menu_button = new JL.Button(
      'Main Menu',
      [width * 0.9, height * 0.9, 400, 100],
      return_to_menu
    );

    this.show_button = false;
    setTimeout(() => {
      this.show_button = true;
    }, 5000);
  }

  async start() {
    // run some dialogue
  }

  handle_click() {
    this.main_menu_button.handle_click();
  }

  update() {}

  show() {
    imageMode(CORNER);

    const p1 = this.results['planet1'] === 'win';
    const p2 = this.results['planet2'] === 'win';
    const p3 = this.results['planet3'] === 'win';

    if (p1 + p2 + p3 < 2) {
      background(images['ending-lose-bg']);
    } else if (!p1) {
      background(images['ending-no-1-bg']);
    } else if (!p2) {
      background(images['ending-no-2-bg']);
    } else if (!p3) {
      background(images['ending-no-3-bg']);
    } else {
      background(images['ending-all-bg']);
    }

    if (this.show_button) this.main_menu_button.show();
  }
}
