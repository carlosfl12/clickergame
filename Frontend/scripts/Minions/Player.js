import Character from './Character.js';

class Player extends Character {
  lvl = 1;
  exp = 0;
  BASE_EXP = 400;
  expToLevelUp = this.BASE_EXP;
  gainExp(value) {
    this.exp += value;
  }

  getPercentageExp() {
    return (this.exp / this.expToLevelUp) * 100;
  }

  getExp() {
    return this.exp;
  }

  levelUp() {
    this.exp = this.expToLevelUp;
    this.stats.damage++;
    this.stats.maxHealth += 10;
    this.lvl++;
    this.expToLevelUp = this.BASE_EXP * this.lvl;
  }
}
export { Player };
