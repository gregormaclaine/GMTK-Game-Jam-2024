class DialogueManager {
  static PROFILE_RECT = [125, 475, 150, 150];
  static INNER_PROFILE_RECT = [125, 475, 125, 125];
  static DIALOGUE_RECT = [750 - 525 / 2, 475, 525, 150];
  static TEXT_RECT = [750 - 525 / 2, 475, 500, 125];
  static SKIP_RECT = [750 - 50, 34, 150, 50];

  static TEXT_SPEED = 50;

  constructor(images, audio) {
    this.images = images;
    this.audio = audio;

    this.active = false;
    this.current_dialogue = null;
    this.progress = 0;

    this.skip = false;
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

  async send(dialogues, wait = 0.5) {
    if (!dialogues.length) return;
    this.active = true;
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

  handle_click() {
    if (this.contains_mouse()) {
      if (!this.current_dialogue || this.current_dialogue.jumpscare) return;
      const t = this.current_dialogue.text;
      const text_index = floor(lerp(0, t.length, this.progress));
      if (text_index < t.length) {
        this.progress = 1;
      } else {
        this.finished_dialogue();
      }
    } else if (this.mouse_over_skip()) {
      this.skip = true;
      this.finished_dialogue();
    }
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
        textSize(22);
        textAlign(LEFT, TOP);
        const t = this.current_dialogue.text;
        const text_index = floor(lerp(0, t.length, this.progress));
        text(t.substring(0, text_index), ...DialogueManager.TEXT_RECT);

        image(images['skip-button'], ...DialogueManager.SKIP_RECT);
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

      if (this.contains_mouse() || this.mouse_over_skip()) cursor('pointer');
    }
  }
}
