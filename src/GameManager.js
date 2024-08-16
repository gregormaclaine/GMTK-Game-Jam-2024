class GameManager {
  constructor({ images, audio }) {
    this.images = images;

    this.state = 'game';

    this.pause_modal = new PauseModal();
  }

  handle_click() {
    if (this.state === 'pause') return this.pause_modal.handle_click();
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
