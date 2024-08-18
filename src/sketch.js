const images = {};
const audio = new JL.Audio(
  [],
  [
    'boom.wav',
    'ability.wav',
    'meteor_hit_1.wav',
    'meteor_hit_2.wav',
    'meteor_hit_3.wav',
    'pickup_gigantium.wav',
    'pickup_minimium.wav',
    'pickup_health_3.wav',
    'pickup_health_2.wav',
    'pickup_health_1.wav',
    'ship_explosion.wav',
    'lazer.wav',
    'invincibility_start.wav',
    'invincibility_end.wav',
    'time_speedup.wav',
    'time_slowdown.wav',
    'asteroid_explode.wav'
  ]
);
let fonts = {};
let scenes;

function preload() {
  // Load fonts
  fonts['light'] = loadFont('assets/font/Oxygen-Light.ttf');
  fonts['regular'] = loadFont('assets/font/RobotoMono-Regular.ttf');
  fonts['bold'] = loadFont('assets/font/Oxygen-Bold.ttf');

  images['rocket'] = loadImage('assets/img/rocket.png');
  images['planes'] = [
    loadImage('assets/img/plane/1.png'),
    loadImage('assets/img/plane/2.png'),
    loadImage('assets/img/plane/3.png'),
    loadImage('assets/img/plane/4.png')
  ];
  images['rock'] = loadImage('assets/img/rock.png');
  images['asteroid'] = loadImage('assets/img/asteroid.png');

  images['gigantium'] = loadImage('assets/img/items/gigantium.png');
  images['minimium'] = loadImage('assets/img/items/minimium.png');
  images['health-crate'] = loadImage('assets/img/items/health-crate.png');

  images['bullet-bg'] = loadImage('assets/img/bullet-bg.png');
  images['wood-bg'] = loadImage('assets/img/wood-bg.png');

  images['cat-profile'] = loadImage('assets/img/profiles/cat.png');
  images['china-cat-profile'] = loadImage('assets/img/profiles/china-cat.png');

  images['cat-heart'] = loadImage('assets/img/cat-heart.png');
  images['skip-button'] = loadImage('assets/img/skip-button.png');
  images['dialogue-profile'] = loadImage('assets/img/dialogue-profile.png');
  images['dialogue-box'] = loadImage('assets/img/dialogue-box.png');

  images['ability-clock'] = loadImage('assets/img/abilities/clock.png');
  images['ability-blackhole'] = loadImage('assets/img/abilities/blackhole.png');
  images['ability-shield'] = loadImage('assets/img/abilities/shield.png');
  images['ability-lazer'] = loadImage('assets/img/abilities/lazer.png');
  images['force-field'] = loadImage('assets/img/abilities/force-field.png');

  images['ability-clock-item'] = loadImage(
    'assets/img/abilities/clock-item.png'
  );
  images['ability-lazer-item'] = loadImage(
    'assets/img/abilities/lazer-item.png'
  );
  images['ability-blackhole-item'] = loadImage(
    'assets/img/abilities/blackhole-item.png'
  );
  images['ability-shield-item'] = loadImage(
    'assets/img/abilities/shield-item.png'
  );

  // Main Menu
  images['start-button'] = loadImage('assets/img/main_menu/start-button.png');
  images['credits-button'] = loadImage(
    'assets/img/main_menu/credits-button.png'
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
  textFont(fonts['regular']);
  Gif.set_canvas(cnv);
  scenes = new SceneManager(images, audio);
}

function mouseClicked() {
  if (scenes) scenes.handle_click();
}

function keyPressed() {
  // console.log(keyCode);
  if (scenes) scenes.handle_key_press();
}

function draw() {
  cursor();
  if (scenes) {
    scenes.show();
    scenes.update();
  }
}
