class Score {
  score = 0;

  static addScore(value) {
    this.score += value;
    console.log(this.score);
  }
}
export { Score };
