import ClickHandler from './Handlers/ClickHandler.js';
import Score from './Handlers/ScoreHandler.js';
import TimerHandler from './Handlers/TimeHandler.js';
import { Enemy } from './Minions/Enemy.js';
import { Player } from './Minions/Player.js';
import Warrior from './Minions/Warrior.js';
import Wizard from './Minions/Wizard.js';
import Abilities from './Upgrades/Abilities.js';
import Upgrade from './Upgrades/Upgrade.js';
import Potions from './Usables/Potions.js';
import Utils from './Utils/Utils.js';

const healthBar = document.getElementById('health-bar');
const p = healthBar.querySelector('p');
let stage = 1;
let previousStage = 0;
let dataToSend = {};
let username = await getUserName();

const player = new Player(150, 5);
const button = Utils.boostButton;
button.addEventListener('click', boost);
let enemies = await getEnemies();
let alliesDPS = 0;
let isBoss = false;
const alliesArray = [];

function boost() {
  Upgrade.secondsBought = true;
  Abilities.boostStats(player, 5, 7);
  button.disabled = true;
  setInterval(() => {
    if (Abilities.canBoost) {
      button.disabled = false;
    }
  }, 5);
}

Utils.wizardButton.addEventListener('click', () => {
  if (Score.gold < 25 + Wizard.wizardQuantity) {
    return;
  }
  Score.gold -= 25;
  alliesArray.push(new Wizard(20, 1.5));
  Wizard.wizardBought();
  alliesDPS += 1.5;
  Wizard.addHealth(player, 20);
  Utils.wizardQuantity.innerText = `Wizard: ${Wizard.wizardQuantity}`;
});

Utils.warriorButton.addEventListener('click', () => {
  if (Score.gold < 80 + Warrior.warriorQuantity) {
    return;
  }
  Score.gold -= 80;
  alliesArray.push(new Warrior(40, 3));
  Warrior.warriorBought();
  alliesDPS += 3;
  Warrior.addHealth(player, 40);
  Utils.warriorQuantity.innerText = `Warrior: ${Warrior.warriorQuantity}`;
});

Utils.potionButton.addEventListener('click', () => {
  if (Potions.potions == 0) {
    return;
  }
  Potions.useHealthPotion(player);
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
  Utils.dpsText.innerText = `Daño por segundo: ${alliesDPS}`;
  Utils.expAmount.innerText = player.exp + '/' + player.expToLevelUp;
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
  Utils.message.hidden = true;
  Score.addScoreBasedOnDamageDealt(alliesDPS);
  alliesDealDamage(player.target);
  player.recieveDamage(player.target.stats.damage);
  if (Wizard.wizardQuantity > 0) {
    Wizard.wizardChanceToHeal(player);
  }
  if (Warrior.warriorQuantity > 0) {
    Warrior.warriorChanceToCrit(alliesDPS);
  }
}, 1000);

async function render() {
  Utils.scoreText.innerText = Score.gold;
  Utils.potions.innerText = `Potions: ${Potions.potions} / ${Potions.maxPotions}`;
  if (TimerHandler.paused) {
    return;
  }
  player.target = enemies[0];
  if (!player.target) {
    player.target = enemies[0];
    console.log(player.target);
    console.log(enemies[0]);
  }
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

  if (
    player.target.stats.health <= player.stats.damage &&
    isBoss &&
    enemies.length == 1
  ) {
    enemies = await getEnemies();
    isBoss = false;
    previousStage = stage;
    let random = (Math.random() * 100).toFixed(0);
    if (random <= 5) {
      Potions.potions = Potions.maxPotions;
    }
    if (previousStage % 3 == 0) {
      Potions.potions += 2;
    }
    stage++;
  }
  if (Potions.potions > Potions.maxPotions) {
    Potions.potions = Potions.maxPotions;
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
  if (player.stats.health >= player.stats.maxHealth) {
    player.stats.health = player.stats.maxHealth;
  }
  Utils.playerCurrentHealth.style.width = `${player.getPercentageHealth()}%`;
  Utils.playerHealthAmount.innerText = `${player.stats.health} / ${player.stats.maxHealth}`;
  Utils.expAmount.innerText = player.exp + '/' + player.expToLevelUp;
  Utils.enemyName.innerText = player.target.name;
  Utils.playerDamage.innerText = `Daño: ${player.stats.damage}`;
  Utils.dpsText.innerText = `Daño por segundo: ${alliesDPS}`;
  if (player.exp >= player.expToLevelUp) {
    player.levelUp();
  }
  Utils.enemyDamage.innerText = `Daño: ${player.target.stats.damage}`;
  Utils.expBar.style.width = `${player.getPercentageExp()}%`;
  Utils.enemiesLeft.innerText = `Enemigos restantes: ${enemies.length}`;
  Utils.imagePlace.src = changeImageFromEnemyRace(player.target.race);
  if (TimerHandler.paused) {
    TimerHandler.gamePaused();
  }
  if (player.stats.health <= 0) {
    TimerHandler.paused = true;
    let response = confirm('Has perdido. ¿Intentar de nuevo?');
    if (response) {
      location.reload();
    } else {
      postDataToStats({
        name: username,
        clicks: ClickHandler.clicks,
        cps: ClickHandler.getAverage(),
        score: Score.score,
      });
      saveData(await getIdByName(await getUserName()), dataToSend);
      window.location.href = 'http://localhost:3000/stats';
    }
  }
  dataToSend.level = player.lvl;
  dataToSend.wizard = Wizard.wizardQuantity;
  dataToSend.health = player.stats.health;
  dataToSend.warrior = Warrior.warriorQuantity;
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

dataToSend = {
  level: player.lvl, //Nivel que tenga el player
  health: player.stats.health, // Relacionado con el nivel
  damage: player.stats.damage,
  wizard: 0, //Cada vez que compres un aliado
  warrior: 0,
  stage: 0,
};
// }

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
  const result = await fetch('http://localhost:3000/player');
  const res = await result.json();
  for (let player of res) {
    if (player.name == name) {
      return player.id;
    }
  }
}

async function postDataToStats(data) {
  const result = await fetch('http://localhost:3000/stats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return result.json();
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
