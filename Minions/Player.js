import Character from './Character.js';

class Player extends Character {
  lvl = 1;
  exp = 0;
  expForLeveling = 500 * (this.lvl * 1.5);
  gainExp(value) {
    this.exp += value;
  }

  getPercentageExp() {
    return (this.exp / this.expForLeveling) * 100;
  }

  getExp() {
    return this.exp;
  }

  //TODO: add levels
}
export { Player };
