export default class TimerHandler {
    static time = 0;

    static startTimer() {
        setInterval(() => {
            this.time++;
        }, 1000)
    }
}