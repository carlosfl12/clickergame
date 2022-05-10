export default class ClickHandler {
    static clicks = 0;
    static cps = 0;
    static getClicksPerSecond() {
        this.cps++;
        return this.cps;
    }

    static resetCPS() {
        this.cps = 0;
        setInterval(()=> {this.cps = 0}, 1000);
    }
}