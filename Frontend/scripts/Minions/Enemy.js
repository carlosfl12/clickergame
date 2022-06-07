import Character from './Character.js';
class Enemy extends Character {
  //TODO: add levels and scalate damage, health... can use abilities?
  constructor(name, health, damage, exp, race, gold) {
    super(health, damage);
    this.name = name;
    this.exp = exp;
    this.race = race;
    this.gold = gold;
  }
}

export { Enemy };
