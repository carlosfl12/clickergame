import Character from './Character.js';

class Player extends Character {
  exp = 0;
  gainExp(value) {
    this.exp += value;
  }
  getExp() {
    return this.exp;
  }

  //TODO: add levels
}
export { Player };
