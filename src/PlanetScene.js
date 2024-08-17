class PlanetScene {
  static PLAYER_SPEED = 8;

  constructor({ dialogue }) {
    this.dialogue = dialogue;
    this.player_pos = [width / 2, height / 2];

    this.npcs = [
      new NPC(
        [width / 2, height / 5],
        images['rocket'],
        [50, 50],
        async count => {
          await this.dialogue.send(DIALOGUE.THAT_NPC, { skippable: count > 0 });
        }
      )
    ];
  }

  handle_click() {}
  handle_key_press() {
    if (keyCode == 69) {
      this.npcs.forEach(npc => {
        if (npc.is_interactable(this.player_pos)) npc.interact();
      });
    }
  }

  show() {
    imageMode(CORNER);
    background(images['bullet-bg']);

    this.npcs.forEach(n => n.show(this.player_pos));

    imageMode(CENTER);
    image(images['rock'], ...this.player_pos, 50, 50);
  }

  force_on_screen() {
    const size = [50, 50];
    if (this.player_pos[0] + size[0] / 2 > width) {
      this.player_pos[0] = width - size[0] / 2;
    }

    if (this.player_pos[0] - size[0] / 2 < 0) {
      this.player_pos[0] = size[0] / 2;
    }

    if (this.player_pos[1] + size[1] / 2 > height) {
      this.player_pos[1] = height - size[1] / 2;
    }

    if (this.player_pos[1] - size[1] / 2 < 0) {
      this.player_pos[1] = size[1] / 2;
    }
  }

  update() {
    const vel = createVector(
      keyIsDown(68) - keyIsDown(65),
      keyIsDown(83) - keyIsDown(87)
    );
    vel.setMag(PlanetScene.PLAYER_SPEED);

    this.player_pos[0] += vel.x;
    this.player_pos[1] += vel.y;
    this.force_on_screen();
  }
}
