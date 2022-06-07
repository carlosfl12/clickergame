import Character from './Character.js';
import Utils from '../Utils/Utils.js';
export default class Warrior extends Character {
  static warriorQuantity = 0;
  static warriorBought() {
    this.warriorQuantity++;
  }

  static warriorChanceToCrit(target) {
    let random = (Math.random() * 100).toFixed(0);
    if (random <= 10) {
      target *= 1.5;
      setTimeout(() => {
        Utils.message.hidden = false;
        Utils.message.innerText = '¡Golpe Crítico!';
      }, 1500);
      Utils.message.hidden = true;
    }
    setTimeout(() => {
      target /= 1.5;
    }, 1500);
  }
}
