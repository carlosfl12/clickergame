import ClickHandler from './Handlers/ClickHandler.js';
import Score from './Handlers/ScoreHandler.js';
import TimerHandler from './Handlers/TimeHandler.js';
import { Enemy } from './Minions/Enemy.js';
import { Player } from './Minions/Player.js';
import Abilities from './Upgrades/Abilities.js';
import Upgrade from './Upgrades/Upgrade.js';

const healthBar = document.getElementById('health-bar');
const p = healthBar.querySelector('p');

const enemy1 = new Enemy(200, 3);
const player = new Player(150, 20);
const button = document.querySelector('button');
button.addEventListener('click', boost);
const names = ['Blagh', 'Work', 'Mug', 'Jiejie', 'Khalos', 'Isvoli'];

const enemies = [];

for (let i = 1; i <= 10; i++) {
  const enemy = new Enemy(200 * (i * 0.5), 4);
  let randNum = parseInt((Math.random() * (names.length - 1)).toFixed(0));
  enemy.name = names[randNum];
  enemy.exp = (enemy.stats.health * 0.33) / 2.5;
  console.log(enemy);
  enemies.push(enemy);
}

player.target = enemies[0];

//TODO: Separar cada boost con su respectivo botón
function boost() {
  Upgrade.secondsBought = true;
  Abilities.boostStats(player, 30, 7);
  document.querySelector('button').disabled = true;
  const p = document.createElement('p');
  setInterval(() => {
    if (Abilities.canBoost) {
      document.querySelector('button').disabled = false;
    }
    document.getElementById('boost').appendChild(p).innerText = 'lala';
  }, 5);
}

ClickHandler.resetCPS();
TimerHandler.startTimer();

document.body.addEventListener('click', () => {
  ClickHandler.clicks++;
  player.target.recieveDamage(player.stats.damage);
  document.getElementById(
    'clicks'
  ).innerText = `Número de clicks: ${ClickHandler.clicks}`;
  document.getElementById(
    'cps'
  ).innerText = `Clicks por segundo: ${ClickHandler.getAverage()}`;
  p.style.width = `${player.target.getPercentageHealth()}%`;
  document.getElementById('dps').innerText = `Daño: ${player.stats.damage}`;
  Score.addScoreBasedOnDamageDealt(player.stats.damage);
  if (player.target.getPercentageHealth() <= 10) {
    player.gainExp(player.target.exp);
    console.log(
      `Player gained ${player.target.exp} exp, Current: ${player.getExp()}`
    );
    enemies.shift();
    player.target = enemies[0];
    document.getElementById('enemy-name').innerText = player.target.name;
    console.log(player.target.health);
  }
  if (!player.target) {
    console.log('SPAWN BOSS');
  }
});
