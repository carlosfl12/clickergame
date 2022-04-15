class Player {
  score = 0;

  constructor(health = 100, damage = 0) {
    this.health = health;
    this.damage = damage;
  }

  attack(damage, target) {
    target.health -= damage;
  }
}
export { Player };
