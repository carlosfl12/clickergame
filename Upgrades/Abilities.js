import Upgrade from "./Upgrade.js";

export default class Abilities {
    static canBoost = true;
    static boostStats(target,damage, seconds) {
        this.canBoost = false;
        target.stats.damage += damage;
        let currentTime = seconds * 1000;
        if (Upgrade.secondsBought) {
            currentTime = Upgrade.addSecondsToBoosts(seconds * 1000, 3 * 1000);
            console.log("Seconds: " + (currentTime/1000));
        }
        const interval = setInterval(()=> {
            console.log((currentTime -= 1000) / 1000)
            if (currentTime == 0) {
                clearInterval(interval);
                this.canBoost = true;
            }
        }, 1000)
        setTimeout(() => { 
            target.stats.damage -= damage;
        }, (currentTime));
    }

    static boostScore(score) {
        //haz cosas
        return score * 1.5;
    }
}