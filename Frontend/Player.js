class StaticPlayer {
  static puntuacion = 0;

  static attack() {
    console.log('Atacking');
  }

  constructor(name) {
    this.name = name;
  }
}

// console.log(StaticPlayer.puntuacion);
// StaticPlayer.puntuacion = 100;
// console.log(StaticPlayer.puntuacion);
// StaticPlayer.attack();

class Player {
  static INIT_LIVE = 100;
  static WIZARD_PENALIZATION = 0.9;
  static INIT_DAMAGE = 10;

  attack() {
    this.puntuacion += 100;
  }

  attacked() {
    this.live -= 10;
  }

  constructor(name) {
    this.name = name;
    this.puntuacion = 0;
    this.live = Player.INIT_LIVE * Player.WIZARD_PENALIZATION;
  }
}

export { Player };
