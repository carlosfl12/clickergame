export default class Character {
    constructor(health, damage) {
        this.stats = {
            health: health,
            damage: damage,
        }
        this.stats.maxHealth = health;
    }

    recieveDamage(amount) {
        this.stats.health -= amount; 
    }

    getPercentageHealth() {
        return (this.stats.health / this.stats.maxHealth) * 100;
    }
}