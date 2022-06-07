async function getStats() {
  const result = await fetch('http://localhost:3000/playerstats');
  const res = await result.json();
  return res;
}

async function getPlayerStats() {
  const result = await fetch('http://localhost:3000/playerdata');
  const res = await result.json();
  return res;
}

const table1 = document.getElementById('table1');
const td = document.createElement('td');
const clicksDatata = await getStats();
const playersData = await getPlayerStats();
const table2 = document.getElementById('table2');
for (let field of clicksDatata) {
  const date = new Date(field.date);
  const tdName = document.createElement('td');
  const tdClicks = document.createElement('td');
  const tdCPS = document.createElement('td');
  const tdScore = document.createElement('td');
  const tdDate = document.createElement('td');
  const otherTr = document.createElement('tr');
  table1.appendChild(otherTr);
  appendElements(otherTr, tdName, tdClicks, tdCPS, tdScore, tdDate);
  tdName.innerText = field.name;
  tdClicks.innerText = field.clicks;
  tdCPS.innerText = field.cps;
  tdScore.innerText = field.score;
  tdDate.innerText = date.toLocaleDateString();
}

for (let playerdata of playersData) {
  const tdName = document.createElement('td');
  const tdLvl = document.createElement('td');
  const tdHealth = document.createElement('td');
  const tdDamage = document.createElement('td');
  const tdWizard = document.createElement('td');
  const tdWarrior = document.createElement('td');
  const tdStage = document.createElement('td');
  const otherTr = document.createElement('tr');
  table2.appendChild(otherTr);
  appendElements(
    otherTr,
    tdName,
    tdLvl,
    tdHealth,
    tdDamage,
    tdWizard,
    tdWarrior,
    tdStage
  );
  tdName.innerText = playerdata.name;
  tdLvl.innerText = playerdata.level;
  tdHealth.innerText = playerdata.health;
  tdDamage.innerText = playerdata.damage;
  tdWizard.innerText = playerdata.wizard;
  tdWarrior.innerText = playerdata.warrior;
  tdStage.innerText = playerdata.stage;
}
function appendElements(where, ...elements) {
  elements.forEach((elem) => {
    where.appendChild(elem);
  });
}
