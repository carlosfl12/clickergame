import Abilities from '../Upgrades/Abilities.js';

export default class Score {
  static score = 0;
  static gold = 0;
  static getScore() {
    return this.score;
  }

  static addScoreBasedOnDamageDealt(value) {
    if (!Abilities.canBoost) {
      this.score += Abilities.boostScore(value);
    } else {
      this.score += value;
      //En vez de score que den oro y asi comprar aliados
    }
  }

  static addGold(value) {
    this.gold += value;
  }
}
