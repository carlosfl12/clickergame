const healthBar = document.getElementById('health-bar');
const p = healthBar.querySelector('p');
console.log(p);
let health = 50;
document.body.addEventListener('click', () => {
  health -= 2;
  p.style.width = health + '%';
});
