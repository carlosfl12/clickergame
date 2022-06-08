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
  static warriorButton = document.getElementsByClassName('warrior')[0];
  static warriorQuantity =
    document.getElementsByClassName('warrior-quantity')[0];
  static enemiesLeft = document.getElementById('enemies-left');
  static expBar = document.getElementById('bar');
  static playerName = document.getElementById('player-name');
  static saveButton = document.getElementById('save-button');
  static imagePlace = document.getElementById('img');
  static enemyName = document.getElementById('enemy-name');
  static boostButton = document.getElementsByClassName('boost')[0];
  static clicksText = document.getElementById('clicks');
  static cpsText = document.getElementById('cps');
  static dpsText = document.getElementById('dps');
  static expAmount = document.getElementById('exp-amount');
  static scoreText = document.getElementById('score');
  static playerDamage = document.getElementById('player-dmg');
  static playerButtonDamage = document.getElementById('upgrade-player-attack');
  static enemyDamage = document.getElementById('enemy-dmg');
  static stageText = document.getElementById('stage');
  static playerCurrentHealth = document.getElementById('player-health-bar');
  static playerHealthAmount = document.getElementById('health-amount');
  static potions = document.getElementById('potions');
  static potionButton = document.getElementById('potion');
  static message = document.getElementById('message');
}
