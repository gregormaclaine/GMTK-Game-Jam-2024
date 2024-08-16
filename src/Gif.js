const all_gifs = [];

class Gif {
  static FADE_TIME = 0.8;

  constructor({ path, alt, duration, width, height, audio }) {
    this.path = path;
    this.duration = duration;
    this.width = width;
    this.height = height || width;
    this.audio = audio;

    this.image = createImg(this.path, alt);
    this.image.hide();
    this.image.style('width', `${this.width}px`);
    this.image.style('height', `${this.height}px`);
    this.image.class('prevent-select');

    this.showing = false;

    this.fade_mode = null;
    this.fade_progress = 0;
    this.fade_completed = () => {};

    all_gifs.push(this);
  }

  static set_canvas(cnv) {
    cnv.elt.parentElement.style.position = 'relative';
    all_gifs.forEach(g => g.image.parent(cnv.elt.parentElement));
  }

  get_corner_pos(pos) {
    const [midx, midy] = pos;
    return [midx - this.width / 2, midy - this.height / 2];
  }

  async play(pos, sound) {
    this.image.position(...this.get_corner_pos(pos));
    this.image.removeAttribute('src');
    this.image.show();

    if (sound && this.audio) this.audio.play_sound(sound);
    this.image.attribute('src', this.path);
    await timeout(this.duration);

    this.image.hide();
  }

  start_loop(pos) {
    this.showing = true;
    this.image.position(...this.get_corner_pos(pos));
    this.image.style('opacity', 1);
    this.image.removeAttribute('src');
    this.image.show();
    this.image.attribute('src', this.path);
  }

  stop_loop() {
    this.showing = false;
    this.image.hide();
  }

  async fade_in(pos) {
    this.showing = true;
    this.fade_mode = 'in';
    this.fade_progress = 0;
    this.image.position(...this.get_corner_pos(pos));
    this.image.removeAttribute('src');
    this.image.style('opacity', 0);
    this.image.show();
    this.image.attribute('src', this.path);
    await new Promise(resolve => (this.fade_completed = resolve));
    this.fade_mode = null;
  }

  async fade_out() {
    this.fade_mode = 'out';
    this.fade_progress = 1;
    this.image.style('opacity', 1);
    await new Promise(resolve => (this.fade_completed = resolve));
    this.image.hide();
    this.showing = false;
    this.fade_mode = null;
  }

  update() {
    if (!this.fade_mode) return;

    this.fade_progress +=
      (1 / (frameRate() || 60) / Gif.FADE_TIME) *
      (this.fade_mode === 'in' ? 1 : -1);
    if (this.fade_progress < 0 || this.fade_progress > 1) {
      this.fade_progress = round(this.fade_progress);
      this.fade_completed();
    }
    this.image.style('opacity', this.fade_progress);
  }
}
