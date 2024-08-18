class DarkPlanet extends PlanetScene {
  reset() {
    this.track = 'planet-2.mp3';
    this.player_pos = [width / 2, height * 0.9];
    this.player_size = [200, 200];
    this.player_image = images['you-shadow-dark'];
    this.background = images['dark-bg'];
    this.bounding_rect = [150, 0, 0, 150];
    this.npcs = [
      new NPC({
        pos: [width * 0.18, height * 0.15],
        image: images['dark-cat'],
        size: [250, 250],
        radius: 1,
        interact: async (count, reset_count) => {}
      })
    ];
  }
}
