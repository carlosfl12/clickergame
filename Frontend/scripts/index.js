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

const player = new Player(150, 5);
const button = document.querySelector('button');
button.addEventListener('click', boost);
const enemies = await getEnemies();

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
  }
  if (!player.target) {
    console.log('SPAWN BOSS');
  }
});

function render() {
  if (TimerHandler.paused) {
    return;
  }
  player.target = enemies[0];
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
  p.style.width = `${player.target.getPercentageHealth()}%`;
  if (p.style.width <= '1%') {
    player.gainExp(player.target.exp);
    enemies.shift();
  }
  document.getElementById('enemy-name').innerText = player.target.name;
  alliesDealDamage(player.target);
  if (player.exp >= player.expToLevelUp) {
    player.levelUp();
  }
  Utils.expBar.style.width = `${player.getPercentageExp()}%`;
  Utils.enemiesLeft.innerText = `Enemies left: ${enemies.length}`;
  Utils.imagePlace.src = changeImageFromEnemyRace(player.target.race);
  if (TimerHandler.paused) {
    TimerHandler.gamePaused();
  }
  dataToSend.level = player.lvl;
  dataToSend.wizard = parseInt(Utils.wizardQuantity.innerText);
  dataToSend.health = player.stats.damage;
  dataToSend.warrior = parseInt('0');
}
document.body.addEventListener('keydown', (e) => {
  if (e.key == 'Escape') {
    TimerHandler.paused = !TimerHandler.paused;
    //Mostrar que el juego está en pausa
  }
});
setInterval(() => {
  if (TimerHandler.paused) {
    return;
  }
  render();
}, 1000 / Utils.FPS);

let dataToSend = {
  level: player.lvl, //Nivel que tenga el player
  health: player.stats.health, // Relacionado con el nivel
  damage: player.stats.damage,
  wizard: 0, //Cada vez que compres un aliado
  warrior: 0,
};

function changeImageFromEnemyRace(race) {
  switch (race) {
    case 'orc':
      return 'orc.png';
    case 'goblin':
      return 'goblin.png';
    case 'spider':
      return 'giant-spider.png';
  }
}

//API FUNCTIONS

async function getIdByName(name) {
  // API FUNCIONA
  const result = await fetch('http://localhost:3000/player');
  const res = await result.json();
  for (let player of res) {
    if (player.name == name) {
      return player.id;
    }
  }
}

async function saveData(id, data) {
  const result = await fetch(`http://localhost:3000/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return result.json();
}

async function getUserName() {
  const result = await fetch('http://localhost:3000/username');
  const res = await result.json();
  return res[0].name;
}

Utils.saveButton.addEventListener('click', async () => {
  saveData(await getIdByName(await getUserName()), dataToSend);
});

async function getEnemies() {
  const result = await fetch('http://localhost:3000/enemies');
  const res = await result.json();
  const enemies = [];
  for (let enemy of res) {
    enemies.push(
      new Enemy(enemy.name, enemy.health, enemy.damage, enemy.exp, enemy.race)
    );
  }
  return enemies;
}
