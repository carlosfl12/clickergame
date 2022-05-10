export default class Upgrade {
    static addDamage(target, amount) {
        target.stats.damage += amount;
    }

    static addHealth(target, amount) {
        target.stats.healht += amount;
    }
}