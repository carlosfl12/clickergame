export default class TimerHandler {
  static time = 0;
  static timer;
  static paused = false;
  static startTimer() {
    this.timer = setInterval(() => {
      if (this.paused) {
        this.time == this.time;
        return;
      }
      this.time++;
    }, 1000);
  }
  static gamePaused() {
    clearInterval(this.timer);
    console.log('PAUSED');
  }
}
