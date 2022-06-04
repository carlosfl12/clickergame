import TimerHandler from "./TimeHandler.js";

export default class ClickHandler {
    static clicks = 0;
    static time = 0;
    static cps = 0;
    static getClicksPerSecond() {
        this.cps++;
        return this.cps;
    }

    static resetCPS() {
        this.cps = 0;
        setInterval(()=> {this.cps = 0}, 1000)
    }

    static getAverage() {
        return (this.clicks / TimerHandler.time).toFixed(2);
    }
}