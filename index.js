import ClickHandler from './Handlers/ClickHandler.js';
import Score from './Handlers/ScoreHandler.js';
import TimerHandler from './Handlers/TimeHandler.js';
import { Enemy } from './Minions/Enemy.js';
import { Player } from './Minions/Player.js';
import Wizard from './Minions/Wizard.js';
import Abilities from './Upgrades/Abilities.js';
import Upgrade from './Upgrades/Upgrade.js';
import Utils from './Utils/Utils.js';

const healthBar = document.getElementById('health-bar');
const p = healthBar.querySelector('p');

const player = new Player(150, 200);
const button = document.querySelector('button');
button.addEventListener('click', boost);
const names = ['Blagh', 'Work', 'Mug', 'Jiejie', 'Onka', 'Isoli'];

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
  setInterval(() => {
    if (Abilities.canBoost) {
      document.querySelector('button').disabled = false;
    }
  }, 5);
}

const alliesArray = [];

Utils.wizardButton.addEventListener('click', () => {
  alliesArray.push(new Wizard(50, 100));
  Utils.wizardQuantity.innerText++;
});

function alliesDealDamage(target) {
  alliesArray.forEach((ally) => {
    target.recieveDamage(ally.damagePerSecond(ally.stats.damage));
  });
}

ClickHandler.resetCPS();
TimerHandler.startTimer();

document.body.addEventListener('click', () => {
  if (TimerHandler.paused) {
    return;
  }
  ClickHandler.clicks++;
  console.log(player.target);
  if (enemies.length == 1 && player.targetBoss == null) {
    player.targetBoss = new Enemy(
      enemies[0].stats.health * 2,
      enemies[0].stats.damage * 1.5
    );
    player.targetBoss.name = 'BOSS!';
  }
  if (!player.target) {
    player.target = player.targetBoss;
    document.getElementById('enemy-name').innerText = player.target.name;
  }
  player.target.recieveDamage(player.stats.damage);
  document.getElementById(
    'clicks'
  ).innerText = `Número de clicks: ${ClickHandler.clicks}`;
  document.getElementById(
    'cps'
  ).innerText = `Clicks por segundo: ${ClickHandler.getAverage()}`;
  p.style.width = `${player.target.getPercentageHealth()}%`;
  document.getElementById('dps').innerText = `Daño: ${player.stats.damage}`;
  document.getElementsByClassName('amount')[0].innerText =
    player.exp + '/' + player.expToLevelUp;
  document.getElementById('bar').style.width = `${player.getPercentageExp()}%`;
  Score.addScoreBasedOnDamageDealt(player.stats.damage);
  if (player.target.getPercentageHealth() <= 10) {
    player.gainExp(player.target.exp);
    console.log(
      `Player gained ${
        player.target.exp
      } exp, Current: ${player.getExp()} Player exp % ${player.getPercentageExp()}`
    );
    enemies.shift();
    player.target = enemies[0];
    document.getElementById('enemy-name').innerText = player.target.name;
  }
  if (player.exp >= player.expToLevelUp) {
    player.levelUp();
    console.log(player.lvl);
  }
  if (!player.target) {
    console.log('SPAWN BOSS');
  }
});

function render() {
  player.target = enemies[0];
  p.style.width = `${player.target.getPercentageHealth()}%`;
  document.getElementById('enemy-name').innerText = player.target.name;
  alliesDealDamage(player.target);
  if (p.style.width <= '1%') {
    player.gainExp(player.target.exp);
    enemies.shift();
  }
  if (player.exp >= player.expToLevelUp) {
    player.levelUp();
  }
  Utils.expBar.style.width = `${player.getPercentageExp()}%`;
  Utils.enemiesLeft.innerText = `Enemies left: ${enemies.length}`;
  const img = document.getElementById('img');
  img.src = './Frontend/img/orco.png';
  if (TimerHandler.paused) {
    TimerHandler.gamePaused();
  }
}
document.body.addEventListener('keydown', (e) => {
  if (e.key == 'Escape') {
    TimerHandler.paused = !TimerHandler.paused;
  }
});
setInterval(() => {
  if (TimerHandler.paused) {
    return;
  }
  render();
}, 1000 / Utils.FPS);

Utils.saveButton.addEventListener('click', () => {
  console.log('tiene que guardar');

  let dataToSend = {
    name: 'Nombre',
    level: 10,
    health: 3000,
    damage: 300,
    wizard: 3,
    warrior: 2,
  };
  fetch('http://localhost:3000/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'JSON',
    },
    body: JSON.stringify(dataToSend),
  });
});

// async function testeo() {
// API FUNCIONA
//   const result = await fetch('http://localhost:3000/enemies');
//   const res = await result.json();
//   console.log(res);
// }

// testeo();
