export default class Upgrade {
  static secondsBought = false;
  static secondsUpgrade = 0;
  static addDamage(target, amount) {
    target.stats.damage += amount;
  }

  static addHealth(target, amount) {
    target.stats.healht += amount;
  }

  static addSecondsToBoosts(seconds, amount) {
    this.secondsBought = true;
    this.secondsUpgrade++;
    seconds += this.secondsUpgrade * 1000;
    return seconds + amount;
  }
}
