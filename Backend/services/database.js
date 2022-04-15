const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'enemigos',
});

con.connect(function (err) {
  // const insert =
  //   "INSERT into enemigo (name, health, damage) VALUES ('Jose Juan', '100', 30)";
  // con.query(insert, function (err) {
  //   if (err) {
  //     console.log(err.message);
  //     return;
  //   }
  //   console.log('RECORDED');
  // });
});

async function getEnemies() {
  con.query('SELECT * From enemigo', (err, result) => {
    let results = result;
    return results;
  });
}
module.exports = { getEnemies };
