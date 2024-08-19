class EndScene {
  constructor({ collected, results, return_to_menu, dialogue, audio }) {
    this.collected = collected;
    this.results = results;
    this.dialogue = dialogue;
    this.audio = audio;

    this.main_menu_button = new JL.Button(
      'Main Menu',
      [width * 0.85, height * 0.95, 350, 80],
      return_to_menu
    );

    this.dialogue_state = null;
  }

  async send_dialogue() {
    const p1 = this.results['planet1'] === 'win';
    const p2 = this.results['planet2'] === 'win';
    const p3 = this.results['planet3'] === 'win';
    const saved_planets = p1 + p2 + p3;
    if (saved_planets === 3) {
      await this.dialogue.send(DIALOGUE.PERFECT_ENDING);
    } else if (saved_planets === 2) {
      await this.dialogue.send(DIALOGUE.GOOD_ENDING);
    } else {
      await this.dialogue.send(DIALOGUE.BAD_ENDING);
    }

    this.show_button = false;
    setTimeout(() => {
      this.show_button = true;
    }, 6000);
  }

  handle_click() {
    this.main_menu_button.handle_click();
  }

  update() {
    if (this.dialogue_state === null) {
      this.dialogue_state = 'active';
      this.send_dialogue().then(() => {
        this.dialogue_state = 'done';
        this.audio.play_track('ending.mp3', true);
      });
    }
  }

  show() {
    if (this.dialogue_state != 'done') {
      background(0);
      return;
    }

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
