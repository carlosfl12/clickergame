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

const table = document.querySelector('table');
const td = document.createElement('td');
const clicksDatata = await getStats();
for (let field of clicksDatata) {
  const date = new Date(field.date);
  const tdName = document.createElement('td');
  const tdClicks = document.createElement('td');
  const tdCPS = document.createElement('td');
  const tdScore = document.createElement('td');
  const tdDate = document.createElement('td');
  const otherTr = document.createElement('tr');
  table.appendChild(otherTr);
  appendElements(otherTr, tdName, tdClicks, tdCPS, tdScore, tdDate);
  tdName.innerText = field.name;
  tdClicks.innerText = field.clicks;
  tdCPS.innerText = field.cps;
  tdScore.innerText = field.score;
  tdDate.innerText = date.toLocaleDateString();
}
// const table2 = document.getElementById('table2');
// const playerData = await getPlayerStats();
// for (let data of playerData) {
//   const tdName = document.createElement('td');
//   const tdClicks = document.createElement('td');
//   const otherTr = document.createElement('tr');
//   table2.appendChild(otherTr);
//   appendElements(otherTr, tdName, tdClicks);
//   tdName.innerText = data.name;
//   tdClicks.innerText = data.level;
// }
function appendElements(where, ...elements) {
  elements.forEach((elem) => {
    where.appendChild(elem);
  });
}
