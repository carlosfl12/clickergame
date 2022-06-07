import Character from './Character.js';

export default class Wizard extends Character {
  static wizardQuantity = 0;
  static wizardBought() {
    this.wizardQuantity++;
  }
}
