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
let stage = 1;

const player = new Player(150, 5);
const button = Utils.boostButton;
button.addEventListener('click', boost);
let enemies = await getEnemies();
let alliesDPS = 0;
let isBoss = false;
const alliesArray = [];

//TODO: Separar cada boost con su respectivo botón
function boost() {
  Upgrade.secondsBought = true;
  Abilities.boostStats(player, 30, 7);
  button.disabled = true;
  setInterval(() => {
    if (Abilities.canBoost) {
      button.disabled = false;
    }
  }, 5);
}

Utils.wizardButton.addEventListener('click', () => {
  if (Score.gold < 25 + Wizard.wizardQuantity) {
    // return;
  }
  Score.gold -= 25;
  alliesArray.push(new Wizard(50, 1.5));
  Wizard.wizardBought();
  alliesDPS += 1.5;
  Wizard.addHealth(player, 50);
  Utils.wizardQuantity.innerText = `Wizard: ${Wizard.wizardQuantity}`;
});

function alliesDealDamage(target) {
  alliesArray.forEach((ally) => {
    target.recieveDamage(ally.stats.damage);
  });
}

ClickHandler.resetCPS();
TimerHandler.startTimer();
Utils.imagePlace.addEventListener('click', () => {
  if (TimerHandler.paused) {
    return;
  }
  ClickHandler.clicks++;
  if (enemies.length == 1 && !isBoss) {
    enemies.push(
      new Enemy(
        enemies[0].name + ' Boss',
        enemies[0].stats.health * 2,
        enemies[0].stats.damage * 1.5,
        enemies[0].exp * 3,
        enemies[0].race,
        enemies[0].gold * player.lvl
      )
    );
    isBoss = true;
  }
  player.target.recieveDamage(player.stats.damage);
  Utils.clicksText.innerText = `Número de clicks: ${ClickHandler.clicks}`;
  Utils.cpsText.innerText = `Clicks por segundo: ${ClickHandler.getAverage()}`;
  p.style.width = `${player.target.getPercentageHealth()}%`;
  Utils.dpsText.innerText = `Daño: ${player.stats.damage}`;
  Utils.amount.innerText = player.exp + '/' + player.expToLevelUp;
  Utils.expBar.style.width = `${player.getPercentageExp()}%`;
  Score.addScoreBasedOnDamageDealt(player.stats.damage);
  if (player.target.getPercentageHealth() <= 1) {
    player.gainExp(player.target.exp);
    Score.addGold(player.target.gold);
    enemies.shift();
    player.target = enemies[0];
  }
  if (player.exp >= player.expToLevelUp) {
    player.levelUp();
  }
});

setInterval(() => {
  Score.addScoreBasedOnDamageDealt(alliesDPS);
  alliesDealDamage(player.target);
}, 1000);

async function render() {
  Utils.scoreText.innerText = Score.gold;
  if (TimerHandler.paused) {
    return;
  }
  player.target = enemies[0];
  if (enemies.length == 1 && !isBoss) {
    enemies.push(
      new Enemy(
        enemies[0].name + ' Boss',
        enemies[0].stats.health * 2,
        enemies[0].stats.damage * 1.5,
        enemies[0].exp * 3,
        enemies[0].race,
        enemies[0].gold * player.lvl
      )
    );
    isBoss = true;
  }
  console.log(player.target.stats.health, isBoss, enemies.length);
  if (player.target.stats.health <= 35 && isBoss && enemies.length == 1) {
    enemies = await getEnemies();
    isBoss = false;
    stage++;
  }
  Utils.stageText.innerText = `Zona: ${stage}`;
  p.style.width = `${player.target.getPercentageHealth()}%`;
  if (
    p.style.width <= '1.5%' ||
    player.target.stats.health <= alliesDPS / 100
  ) {
    player.gainExp(player.target.exp);
    Score.addGold(player.target.gold);
    enemies.shift();
  }
  Utils.amount.innerText = player.exp + '/' + player.expToLevelUp;
  Utils.enemyName.innerText = player.target.name;
  Utils.dpsText.innerText = `Daño por segundo: ${alliesDPS}`;
  Utils.damageText.innerText = `Daño: ${player.target.stats.damage}`;
  if (player.exp >= player.expToLevelUp) {
    player.levelUp();
  }
  Utils.expBar.style.width = `${player.getPercentageExp()}%`;
  Utils.enemiesLeft.innerText = `Enemigos restantes: ${enemies.length}`;
  Utils.imagePlace.src = changeImageFromEnemyRace(player.target.race);
  if (TimerHandler.paused) {
    TimerHandler.gamePaused();
  }
  dataToSend.level = player.lvl;
  dataToSend.wizard = Wizard.wizardQuantity;
  dataToSend.health = player.stats.damage;
  dataToSend.warrior = parseInt('0');
  dataToSend.stage = stage;
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
  stage: 0,
};

function changeImageFromEnemyRace(race) {
  switch (race) {
    case 'orc':
      return 'orc.png';
    case 'goblin':
      return 'goblin.png';
    case 'spider':
      return 'giant-spider.png';
    case 'troll':
      return 'troll.png';
    case 'lich':
      return 'lich.png';
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
      new Enemy(
        enemy.name,
        enemy.health + player.lvl * 5,
        enemy.damage + player.lvl * 2,
        enemy.exp + player.lvl * 0.5,
        enemy.race,
        enemy.gold + player.lvl
      )
    );
  }
  return enemies;
}
