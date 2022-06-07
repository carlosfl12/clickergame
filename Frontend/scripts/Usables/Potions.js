export default class Potions {
  static maxPotions = 5;
  static potions = this.maxPotions;
  static useHealthPotion(target) {
    target.stats.health = target.stats.maxHealth;
    this.potions--;
  }
}
