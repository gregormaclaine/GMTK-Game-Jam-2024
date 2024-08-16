class GameManager {
  constructor({ images, audio, dialogue, end_game }) {
    this.images = images;
    this.audio = audio;
    this.dialogue = dialogue;
    this.end_game = end_game;

    this.state = 'game';

    this.pause_modal = new PauseModal();
  }

  async handle_click() {
    if (this.state === 'pause') return this.pause_modal.handle_click();

    this.dialogue
      .send([
        {
          profile: 'skip-button',
          text: 'I am some dialogue'
        },
        {
          image: 'menu-bg',
          jumpscare: true
        }
      ])
      .then(this.end_game);
  }

  handle_key_press() {
    if (this.state === 'pause') return this.pause_modal.handle_key_press();

    if (['game'].includes(this.state)) {
      const prev_state = this.state;
      if (keyCode === PAUSE_KEY_CODE) {
        this.pause_modal.open(() => (this.state = prev_state));
        return (this.state = 'pause');
      }
    }
  }

  show() {
    if (this.state === 'pause') this.pause_modal.show();
  }

  update() {
    switch (this.state) {
      case 'game':
        return;

      case 'pause':
        this.pause_modal.update();
        return;
    }
  }
}
