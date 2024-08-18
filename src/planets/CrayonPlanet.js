class CrayonPlanet extends PlanetScene {
  reset() {
    this.track = 'planet-3.mp3';
    this.player_pos = [width / 2, height * 0.9];
    this.player_size = [200, 200];
    this.player_image = images['you-shadow'];
    this.background = images['wood-bg'];
    this.bounding_rect = [0, 0, 0, 0];
    this.npcs = [];
  }
}
