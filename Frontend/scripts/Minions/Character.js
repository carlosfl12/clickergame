export default class Character {
  constructor(health, damage) {
    this.stats = {
      health: health,
      damage: damage,
    };
    this.stats.maxHealth = health;
  }

  recieveDamage(amount) {
    this.stats.health -= amount;
  }

  getPercentageHealth() {
    return (this.stats.health / this.stats.maxHealth) * 100;
  }

  damagePerSecond(damage) {
    return damage / 1000;
  }

  static addHealth(target, qty) {
    target.stats.maxHealth += qty;
  }
}
