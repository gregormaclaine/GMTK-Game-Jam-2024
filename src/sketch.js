const images = {};
const audio = new JL.Audio([], ['boom.wav']);
let scenes;

function preload() {
  // Load fonts
  fontLight = loadFont('assets/font/Oxygen-Light.ttf');
  fontRegular = loadFont('assets/font/Oxygen-Regular.ttf');
  fontBold = loadFont('assets/font/Oxygen-Bold.ttf');

  images['skip-button'] = loadImage('assets/img/skip-button.png');
  images['dialogue-profile'] = loadImage('assets/img/dialogue-profile.png');
  images['dialogue-box'] = loadImage('assets/img/dialogue-box.png');

  // Main Menu
  images['menu-bg'] = loadImage('assets/img/main_menu/background.jpg');
  images['start-button'] = loadImage('assets/img/main_menu/start_button.png');
  images['credits-button'] = loadImage(
    'assets/img/main_menu/credits_button.png'
  );

  // Gifs
  // images['spinning-fish'] = new Gif({
  //   path: 'assets/img/spinning-fish.gif',
  //   duration: 1000,
  //   alt: 'feesh',
  //   width: 400,
  //   height: 173
  // });

  audio.preload();
}

function setup() {
  const cnv = createCanvas(1600, 1200);
  textFont(fontRegular);
  Gif.set_canvas(cnv);
  scenes = new SceneManager(images, audio);
}

function mouseClicked() {
  scenes.handle_click();
}

function keyPressed() {
  // console.log(keyCode);
  scenes.handle_key_press();
}

function draw() {
  cursor();
  scenes.show();
  scenes.update();
}
