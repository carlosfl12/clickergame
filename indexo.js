import ClickHandler from './Handlers/ClickHandler.js';
import {Enemy} from './Minions/Enemy.js';
import { Player } from './Minions/Player.js';
import Abilities from './Upgrades/Abilities.js';

const healthBar = document.getElementById('health-bar');
const p = healthBar.querySelector('p');


const enemy1 = new Enemy(200,3);
const player = new Player(150,1);
document.querySelector('button').addEventListener('click', boost)

function boost() {
  Abilities.boostStats(player);
  console.log("boosting player");
  document.querySelector('button').disabled = true;
}


ClickHandler.resetCPS();
document.body.addEventListener('click', () => {
  ClickHandler.clicks++;
  enemy1.recieveDamage(player.stats.damage);
  document.getElementById("clicks").innerText = `Número de clicks: ${ClickHandler.clicks}`;
  document.getElementById("cps").innerText = `Clicks por segundo: ${ClickHandler.getClicksPerSecond()}`;
  p.style.width = `${enemy1.getPercentageHealth()}%`;
  document.getElementById('dps').innerText = `Daño: ${player.stats.damage}`;
  player.getScoreBasedOnDamageDealt(player.stats.damage);
  console.log(player.score);
});