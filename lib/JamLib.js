const timeout = time => new Promise(resolve => setTimeout(resolve, time));

const JamLib = {
  version: '1.0.0',
  Audio: class {
    /**
     * Lib for all music and sound control. Filenames should not include folder path.
     * Requires p5js sound library.
     *
     * __P5 Funcs:__ preload
     * @param {string[]} music_tracks List of .mp3 music filenames for continuous play
     * @param {string[]} sound_tracks List of .wav sound filenames for triggered play
     * @param {string} music_folder Folder for music files: `/assets/music/`
     * @param {string} sound_folder Folder for sound files: `/assets/sfx/`
     */
    constructor(
      music_tracks,
      sound_tracks,
      music_folder = 'assets/music/',
      sound_folder = 'assets/sfx/'
    ) {
      this.tracks = music_tracks;
      this.sound_names = sound_tracks;

      this.music_path = music_folder;
      this.sound_path = sound_folder;

      this.audio_tracks = {};
      this.sounds = {};

      this.current_song = null;
    }

    preload() {
      soundFormats('mp3');
      for (const music of this.tracks) {
        this.audio_tracks[music] = loadSound(this.music_path + music);
      }

      soundFormats('wav');
      for (const sfx of this.sound_names) {
        this.sounds[sfx] = loadSound(this.sound_path + sfx);
      }
    }

    get is_playing() {
      return !!this.current_song;
    }

    /**
     * Starts a music track; Will replace any currently playing music.
     * @param {string} song Song filename
     */
    play_track(song, loop = false) {
      const track = this.audio_tracks[song];
      if (!track)
        return console.error(`Error: ${song} is not an available song.`);

      if (this.is_playing) {
        if (song === this.current_song) return;
        this.stop();
      }

      track.setVolume(0.3);
      track.setLoop(loop);
      track.play();

      this.current_song = song;
    }

    /**
     * Stops currently playing music
     */
    stop() {
      if (this.is_playing) {
        this.audio_tracks[this.current_song].stop();
        this.current_song = null;
      }
    }

    /**
     * Plays a sound effect once
     * @param {string} sfx Sound effect filename
     */
    play_sound(sfx) {
      const sound = this.sounds[sfx];
      if (sound) {
        sound.play();
      } else {
        console.error(`Error: ${sfx} is not an available sound effect`);
      }
    }
  },
  Button: class {
    /**
     * A generic button
     *
     * __P5 Funcs:__ show, handle_click
     * @param {string} text Button text
     * @param {number[]} rect The middle coordinates, width, height: [0,0,0,0]
     * @param {Function} onclick Function to be called upon button press
     */
    constructor(text, rect, onclick) {
      this.text = text;
      this.rect = rect;
      this.onclick = onclick || (() => 0);
    }

    /**
     * Show the button. Also updates cursor depending on hover.
     * @param {number} opacity Opacity from 0 to 255
     */
    show(opacity = 255) {
      if (this.contains_mouse()) cursor('pointer');

      strokeWeight(3);
      const button_opacity =
        (opacity * (this.contains_mouse() ? 255 : 235)) / 255;
      fill(255, button_opacity);
      stroke(0, opacity);
      rectMode(CENTER);
      rect(...this.rect);

      textAlign(CENTER, CENTER);
      stroke(0, opacity);
      strokeWeight(2);
      fill(0, opacity);
      textSize(35);
      text(this.text, this.rect[0], this.rect[1] - 3, ...this.rect.slice(2));
    }

    handle_click() {
      if (this.contains_mouse()) this.onclick();
    }

    /**
     * Returns whether the mouse is hovering over button
     */
    contains_mouse() {
      const [x, y, w, h] = this.rect;
      if (mouseX < x - w / 2) return false;
      if (mouseX > x + w / 2) return false;
      if (mouseY < y - h / 2) return false;
      if (mouseY > y + h / 2) return false;
      return true;
    }
  },
  Toast: class {
    static TOAST_SPEED = 3;
    static HOVER_DURATION = 2000;
    static START_Y = -10;
    static END_Y = 30;

    /**
     * An controller to handle sending a temporary message down from
     * the top of the screen. Send message using `Toast.send()`.
     *
     * __P5 Funcs:__ show
     */
    constructor() {
      this.active = false;
      this.transition_mode = null;
      this.transition_progress = 0;
      this.end_transition_callback = null;

      this.text = '';
    }

    get in_transition() {
      return !!this.transition_mode;
    }

    /**
     * Begin the transition process of showing the toast.
     * @param {string} text The message to show
     */
    async send(text) {
      this.text = text;
      this.active = true;
      await this.transition('down');
      await timeout(JamLib.Toast.HOVER_DURATION);
      await this.transition('up');
      this.active = false;
    }

    transition(mode) {
      this.transition_mode = mode;
      this.transition_progress =
        JamLib.Toast[mode === 'down' ? 'START_Y' : 'END_Y'];
      return new Promise(resolve => (this.end_transition_callback = resolve));
    }

    update_transition() {
      this.transition_progress +=
        (this.transition_mode === 'down' ? 1 : -1) * JamLib.Toast.TOAST_SPEED;
      if (
        this.transition_progress > JamLib.Toast.END_Y ||
        this.transition_progress < JamLib.Toast.START_Y
      ) {
        this.transition_mode = null;
        if (this.end_transition_callback) this.end_transition_callback();
        return true;
      }
    }

    show() {
      if (!this.active) return;

      const pos = [
        width / 2,
        this.in_transition ? this.transition_progress : JamLib.Toast.END_Y
      ];
      textAlign(CENTER, CENTER);
      fill(0);
      stroke(255);
      strokeWeight(3);
      textSize(20);
      text(this.text, ...pos);

      this.update_transition();
    }
  },
  Store: class {
    /**
     * A class to handle saving and collecting data when the page is refreshed.
     *
     * __P5 Funcs:__ show
     * @param {string} cache_key A uniqueish id to use to label the data in localstorage
     */
    constructor(cache_key) {
      this.cache_key = cache_key;

      if (!cache_key) throw new Error('Error: No cache key given to store');

      this.toast = new JamLib.Toast();
    }

    /**
     * Collects the data that was saved, if it is over 10 minutes old it is not given.
     * @returns The data that was saved or `null`.
     */
    read_from_cache() {
      const val = localStorage.getItem(this.cache_key);
      if (!val) return null;
      const { data, timestamp } = JSON.parse(val);
      if (new Date() - timestamp > 1000 * 60 * 10) return null;
      this.toast.send('Restored game state from storage');

      return data;
    }

    /**
     * Saves the current game state to localstorage.
     * @param {Object} data
     */
    save_to_cache(data) {
      localStorage.setItem(
        this.cache_key,
        JSON.stringify({
          data,
          timestamp: new Date()
        })
      );
    }

    /**
     * Empties the saved current game state.
     */
    remove_cache() {
      localStorage.removeItem(this.cache_key);
    }

    show() {
      this.toast.show();
    }
  },
  Credits: class {
    static LH = 20;
    static SPEED = 1.5;

    /**
     * A Credits screen controller; begin the credits with `Credits.start()`.
     *
     * __P5 Funcs:__ show, handle_click
     * @param {string[]} credits_text The total credit text split by lines
     */
    constructor(credits_text) {
      this.text = credits_text;

      this.rolling = false;
      this.progress = 0;
      this.end_credits_callback = null;
    }

    async start() {
      this.rolling = true;
      this.progress = -(JamLib.Credits.LH * (this.text.length - 1));
      await new Promise(resolve => (this.end_callback = resolve));
      this.rolling = false;
    }

    handle_click() {
      if (this.rolling) this.end_callback();
    }

    update() {
      this.progress += JamLib.Credits.SPEED;
      // The -8 below is a random number that seemed to make it work better
      // I don't actually know what was wrong so I just did that
      if (this.progress > JamLib.Credits.LH * (this.text.length - 8) + height) {
        this.end_callback();
      }
    }

    show() {
      background(0);
      textAlign(CENTER, CENTER);
      fill(255);
      stroke(255);
      strokeWeight(0);
      textSize(32);
      for (let i = 0; i < this.text.length; i++) {
        const y = height - (i * JamLib.Credits.LH + this.progress);
        text(this.text[this.text.length - 1 - i], width / 2, y);
      }

      this.update();
    }
  },
  Grid: class {
    /**
     * Displays a grid shape and gives functions to aid displaying things
     * in the cells of the grid. Note the width and height in the `shape`
     * attribute are for the individual cells.
     *
     * __P5 Funcs:__ show, handle_click
     * @param {number[]} shape Size of the grid: `[x, y, w, h, r]`
     * @param {number[]} dim Dimensions of the grid: `[rows, cols]`
     * @param {Function} onclick Callback for if a grid cell is clicked
     */
    constructor(shape, dim, onclick) {
      this.shape = shape;
      this.dim = dim;
      this.onclick = onclick || (() => 0);
    }

    get width() {
      return this.shape[2] * this.dim[0];
    }

    get height() {
      return this.shape[3] * this.dim[1];
    }

    get cellw() {
      return this.shape[2];
    }

    get cellh() {
      return this.shape[3];
    }

    /**
     * Returns the x,y coordinate for the center of a particular cell
     * @param {number} i Row
     * @param {number} j Column
     */
    cell_center(i, j) {
      let [x, y, w, h, r] = this.shape;
      let midx = x - (this.dim[0] / 2 - i - 0.5) * w;
      let midy = y - (this.dim[1] / 2 - j - 0.5) * h;
      return [midx, midy];
    }

    /**
     * Draws the grid to the canvas
     * @param {string[]} data Optional: Contains the list of strings to be drawn in the cells
     */
    show(data = []) {
      if (this.is_mouse_in_grid()) cursor('pointer');

      let [x, y, w, h, r] = this.shape;
      if (r === undefined) r = 2;

      const active_cell = this.is_mouse_in_grid()
        ? this.what_cell(mouseX, mouseY)
        : [-1, -1];

      for (let i = 0; i < this.dim[0]; i++) {
        for (let j = 0; j < this.dim[1]; j++) {
          const [midx, midy] = this.cell_center(i, j);
          const is_active = active_cell[0] === i && active_cell[1] === j;

          rectMode(CENTER);
          fill(is_active ? 240 : 255);
          stroke(0);
          strokeWeight(1);
          rect(midx, midy, w, h, r);

          const content = data[j * this.dim[0] + i];
          if (!content) continue;

          textAlign(CENTER, CENTER);
          strokeWeight(0);
          fill(0);
          textSize(20);
          text(content, midx, midy);
        }
      }
    }

    /**
     * Returns whether the mouse is contained in the overall grid.
     */
    is_mouse_in_grid() {
      const [x, y, w, h, r] = this.shape;
      const [rows, cols] = this.dim;
      if (mouseX < x - (w * rows) / 2) return false;
      if (mouseX > x + (w * rows) / 2) return false;
      if (mouseY < y - (h * cols) / 2) return false;
      if (mouseY > y + (h * cols) / 2) return false;
      return true;
    }

    /**
     * Returns the cell row and column based on a point in the grid.
     * @param {number} x X Coordinate
     * @param {number} y Y Coordinate
     */
    what_cell(x, y) {
      const [midx, midy] = this.shape;

      x -= midx - this.width / 2;
      y -= midy - this.height / 2;

      return [floor(x / 50), floor(y / 50)];
    }

    /**
     * Runs the callback onclick function if mouse is contained in grid cell.
     */
    handle_click() {
      if (this.is_mouse_in_grid()) {
        const [x, y] = this.what_cell(mouseX, mouseY);
        this.onclick([x, y], data[y * this.dim[0] + x]);
      }
    }
  }
};

const JL = JamLib;

console.log(
  '%c🍓 JamLib Successfully Loaded 🍓',
  'color: limegreen; font-weight: bold; font-size: 1.4em;'
);
