class Enemy {
  maxHealth = 200;
  constructor(health = this.maxHealth, damage) {
    this.health = health;
    this.damage = damage;
  }
  getMaxHealth() {
    return this.maxHealth;
  }

  getHealth() {
    return this.health;
  }
}

export { Enemy };
