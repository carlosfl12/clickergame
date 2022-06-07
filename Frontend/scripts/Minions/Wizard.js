import Utils from '../Utils/Utils.js';
import Character from './Character.js';

export default class Wizard extends Character {
  static wizardQuantity = 0;
  static wizardBought() {
    this.wizardQuantity++;
  }
  static wizardChanceToHeal(target) {
    let random = (Math.random() * 100).toFixed(0);
    if (random <= 10) {
      target.stats.health += 20;
      setTimeout(() => {
        Utils.message.hidden = false;
        Utils.message.innerText = '¡Jugador curado!';
      }, 1500);
      Utils.message.hidden = true;
    }
  }
}
