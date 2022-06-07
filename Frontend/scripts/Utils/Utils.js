export default class Utils {
  static FPS = 30;
  static createExpBar(where) {
    let expBar = document.createElement('div');
    where.appendChild(expBar);
    let p = document.createElement('p');
    expBar.appendChild(p);
  }

  static wizardButton = document.getElementsByClassName('wizard')[0];
  static wizardQuantity = document.getElementsByClassName('wizard-quantity')[0];
  static enemiesLeft = document.getElementById('enemies-left');
  static expBar = document.getElementById('bar');
  static playerName = document.getElementById('player-name');
  static saveButton = document.getElementById('save-button');
  static imagePlace = document.getElementById('img');
  static enemyName = document.getElementById('enemy-name');
  static boostButton = document.querySelector('button');
  static clicksText = document.getElementById('clicks');
  static cpsText = document.getElementById('cps');
  static dpsText = document.getElementById('dps');
  static amount = document.getElementsByClassName('amount')[0];
  static scoreText = document.getElementById('score');
  static damageText = document.getElementById('dmg');
  static stageText = document.getElementById('stage');
}
