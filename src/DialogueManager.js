class DialogueManager {
  static PROFILE_RECT = [250, 950, 300, 300];
  static INNER_PROFILE_RECT = [250, 950, 250, 250];
  static DIALOGUE_RECT = [1500 - 1050 / 2, 950, 1050, 300];
  static TEXT_RECT = [1500 - 1050 / 2, 950, 1000, 250];
  static SKIP_RECT = [1500 - 100, 68, 300, 100];

  static TEXT_SPEED = 50;

  constructor(images, audio) {
    this.images = images;
    this.audio = audio;

    this.active = false;
    this.current_dialogue = null;
    this.progress = 0;

    this.skip = false;
    this.skippable = false;
  }

  contains_mouse() {
    const [x, y, w, h] = DialogueManager.DIALOGUE_RECT;
    if (mouseX < x - w / 2) return false;
    if (mouseX > x + w / 2) return false;
    if (mouseY < y - h / 2) return false;
    if (mouseY > y + h / 2) return false;
    return true;
  }

  mouse_over_skip() {
    const [x, y, w, h] = DialogueManager.SKIP_RECT;
    if (mouseX < x - w / 2) return false;
    if (mouseX > x + w / 2) return false;
    if (mouseY < y - h / 2) return false;
    if (mouseY > y + h / 2) return false;
    return true;
  }

  async send(dialogues, { wait = 0, skippable = true } = {}) {
    if (!dialogues.length) return;
    this.active = true;
    this.skippable = skippable;
    await timeout(wait * 1000);
    for (const dialogue of dialogues) {
      if (this.skip) {
        this.skip = false;
        break;
      }

      this.current_dialogue = dialogue;
      this.progress = 0;
      if (dialogue.jumpscare) {
        this.audio.play_sound('boom.wav');
        await timeout(500);
      } else {
        await new Promise(resolve => (this.finished_dialogue = resolve));
      }
    }
    this.current_dialogue = null;
    this.active = false;
  }

  manual_progress() {
    if (!this.current_dialogue || this.current_dialogue.jumpscare) return;
    const t = this.current_dialogue.text;
    const text_index = floor(lerp(0, t.length, this.progress));
    if (text_index < t.length) {
      this.progress = 1;
    } else {
      this.finished_dialogue();
    }
  }

  handle_click() {
    if (this.contains_mouse()) {
      this.manual_progress();
    } else if (this.skippable && this.mouse_over_skip()) {
      this.skip = true;
      this.finished_dialogue();
    }
  }

  handle_key_press() {
    if (keyCode === 69) this.manual_progress();
  }

  show() {
    if (this.current_dialogue) {
      imageMode(CENTER);
      image(this.images['dialogue-profile'], ...DialogueManager.PROFILE_RECT);
      image(this.images['dialogue-box'], ...DialogueManager.DIALOGUE_RECT);

      if (this.current_dialogue.profile) {
        image(
          this.images[this.current_dialogue.profile],
          ...DialogueManager.INNER_PROFILE_RECT
        );
      }

      if (this.current_dialogue.text) {
        rectMode(CENTER);
        fill(0);
        strokeWeight(0);
        textSize(25);
        textAlign(LEFT, TOP);
        const t = this.current_dialogue.text;
        const text_index = floor(lerp(0, t.length, this.progress));
        text(t.substring(0, text_index), ...DialogueManager.TEXT_RECT);

        if (this.skippable) {
          image(images['skip-button'], ...DialogueManager.SKIP_RECT);
        }
      }

      if (this.current_dialogue.jumpscare) {
        image(
          this.images[this.current_dialogue.image],
          width * 0.5,
          height * 0.5,
          width * 0.8,
          height * 0.8
        );
      }
    }
  }

  update() {
    if (this.current_dialogue) {
      if (this.current_dialogue.jumpscare) return;

      this.progress +=
        ((1 / frameRate()) * DialogueManager.TEXT_SPEED) /
        this.current_dialogue.text.length;

      if (this.contains_mouse() || (this.skippable && this.mouse_over_skip()))
        cursor('pointer');
    }
  }
}
