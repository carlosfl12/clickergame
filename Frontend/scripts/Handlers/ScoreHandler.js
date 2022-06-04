import Abilities from "../Upgrades/Abilities.js";

export default class Score {
    static score=0;
    
    static getScore() {
        return this.score;
    }

    static addScoreBasedOnDamageDealt(value) {
        if (!Abilities.canBoost) {
            this.score += Abilities.boostScore(value)
            console.log("With boost: " + this.score)
        } else {
            this.score += value;
            console.log("Without boost: " + this.score)
        }
    }
}