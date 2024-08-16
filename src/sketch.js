const images = {};
const audio = new JL.Audio(
  ['laugh.mp3', 'game.mp3', 'shop.mp3'],
  ['cheer.wav', 'boom.wav', 'star.wav', 'angel.wav', 'buy.wav']
);
let scenes;

function preload() {
  // Load fonts
  // fontLight = loadFont('assets/font/Oxygen-Light.ttf');
  // fontRegular = loadFont('assets/font/Oxygen-Regular.ttf');
  // fontBold = loadFont('assets/font/Oxygen-Bold.ttf');
  // images['hook'] = loadImage('assets/img/fish-hook.png');
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
  const cnv = createCanvas(800, 600);
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
