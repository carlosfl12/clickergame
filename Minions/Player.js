import Character from "./Character.js";

class Player extends Character{
  score = 0;

  getScoreBasedOnDamageDealt(damage) {
    this.score += (damage * 1.2);
  }
}
export { Player };
