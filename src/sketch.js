const images = {};
const audio = new JL.Audio(
  [
    'hell-1.mp3',
    'hell-2.mp3',
    'hell-3.mp3',
    'hell-4.mp3',
    'planet-1.mp3',
    'planet-2.mp3',
    'planet-3.mp3',
    'ending.mp3'
  ],
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

  images['rock'] = loadImage('assets/img/rocks/rock.png');
  images['asteroid'] = loadImage('assets/img/rocks/asteroid.png');
  images['cool-rock'] = loadImage('assets/img/rocks/cool-rock.png');

  images['explosion'] = loadImage('assets/img/explosion.svg');

  images['gigantium'] = loadImage('assets/img/items/gigantium.png');
  images['minimium'] = loadImage('assets/img/items/minimium.png');
  images['health-crate'] = loadImage('assets/img/items/health-crate.png');

  images['bullet-bg'] = loadImage('assets/img/backgrounds/bullet.png');
  images['wood-bg'] = loadImage('assets/img/backgrounds/wood.png');
  images['dark-bg'] = loadImage('assets/img/backgrounds/dark.png');
  images['crayon-bg'] = loadImage('assets/img/backgrounds/crayon.png');

  images['ending-all-bg'] = loadImage('assets/img/backgrounds/ending-all.png');
  images['ending-no-1-bg'] = loadImage(
    'assets/img/backgrounds/ending-no-1.png'
  );
  images['ending-no-2-bg'] = loadImage(
    'assets/img/backgrounds/ending-no-2.png'
  );
  images['ending-no-3-bg'] = loadImage(
    'assets/img/backgrounds/ending-no-3.png'
  );
  images['ending-lose-bg'] = loadImage(
    'assets/img/backgrounds/ending-lose.png'
  );

  images['you-shadow'] = loadImage('assets/img/you-shadow.png');
  images['you-shadow-dark'] = loadImage('assets/img/you-shadow-dark.png');
  images['you-profile'] = loadImage('assets/img/profiles/you.png');

  images['amongus'] = loadImage('assets/img/npcs/amongus.png');
  images['cat'] = loadImage('assets/img/npcs/cat.png');
  images['science-cat'] = loadImage('assets/img/npcs/science-cat.png');
  images['evil-cat'] = loadImage('assets/img/npcs/evil-cat.png');

  images['crayon-cat-1'] = loadImage('assets/img/npcs/crayon-cat.png');
  images['crayon-cat-2'] = loadImage('assets/img/npcs/crayon-cat-2.png');
  images['crayon-cat-3'] = loadImage('assets/img/npcs/crayon-cat-3.png');
  images['crayon-cat-4'] = loadImage('assets/img/npcs/crayon-cat-4.png');

  images['bw-cat-1'] = loadImage('assets/img/npcs/bw-cat-1.png');
  images['bw-cat-2'] = loadImage('assets/img/npcs/bw-cat-2.png');
  images['bw-cat-3'] = loadImage('assets/img/npcs/bw-cat-3.png');
  images['bw-cat-4'] = loadImage('assets/img/npcs/bw-cat-4.png');

  images['bw-cat-1-profile'] = loadImage('assets/img/profiles/bw-cat-1.jpg');
  images['bw-cat-2-profile'] = loadImage('assets/img/profiles/bw-cat-2.jpg');
  images['bw-cat-3-profile'] = loadImage('assets/img/profiles/bw-cat-3.jpg');
  images['bw-cat-4-profile'] = loadImage('assets/img/profiles/bw-cat-4.jpg');

  images['cat-mc'] = loadImage('assets/img/npcs/cat-mc.png');
  images['mystery-cat'] = loadImage('assets/img/npcs/mystery-cat.png');

  images['science-cat-profile'] = loadImage(
    'assets/img/profiles/science-cat.png'
  );
  images['evil-cat-profile'] = loadImage('assets/img/profiles/evil-cat.png');
  images['china-cat-profile'] = loadImage('assets/img/profiles/china-cat.png');
  images['mystery-cat-profile'] = loadImage(
    'assets/img/profiles/mystery-cat.jpg'
  );

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
  images['title'] = loadImage('assets/img/title.png');
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
