export default class Utils {
  static createExpBar(where) {
    let expBar = document.createElement('div');
    where.appendChild(expBar);
    let p = document.createElement('p');
    expBar.appendChild(p);
  }
}
