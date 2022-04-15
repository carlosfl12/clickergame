import { Player } from './Minions/Player.js';
import { Enemy } from './Minions/Enemy.js';
const uji = new Player(100, 0);

const enemy1 = new Enemy();

uji.attack(1, enemy1);

const button = document.createElement('button');
const slider = document.createElement('input');

slider.type = 'range';

document.body.appendChild(slider);

slider.max = enemy1.getMaxHealth();
slider.value = enemy1.getMaxHealth();

const p = document.createElement('p');

document.body.appendChild(p);

console.log(slider.max);
document.body.appendChild(button);

button.addEventListener('click', () => {
  uji.attack(1, enemy1);
  slider.value = enemy1.getHealth();
  p.innerText = enemy1.getHealth();
});
