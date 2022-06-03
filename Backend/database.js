const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clickergame',
});

app.get('/', (req, res) => {
  res.send('Api funcionando');
});

app.get('/player', (req, res) => {
  const sql = 'select * from player';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length == 0) return;
    res.json(result);
  });
});

app.get('/enemies', (req, res) => {
  const sql = 'SELECT * FROM enemies';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      res.send('NO RESULTS');
    }
    res.json(result);
  });
});

app.get('/enemies/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM enemies WHERE id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      res.send('NO RESULTS');
    }
    res.json(result);
  });
});

app.post('/save', (req, res) => {
  // res.send('Data saved');
  const sql = 'Insert into player SET ?';
  const playerSettings = {
    name: req.body.name,
    level: req.body.level,
    health: req.body.health,
    damage: req.body.damage,
    wizard: req.body.wizard,
    warrior: req.body.warrior,
  };

  // res.send(req.body.allies.wizard);

  connection.query(sql, playerSettings, (err) => {
    if (err) throw err;

    res.send('Data saved');
  });
  //This to save data every 30 min or save
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { level, health, damage, wizard, warrior } = req.body;
  const sql = `update player set level = '${level}', health = '${health}', damage = '${damage}', wizard = '${wizard}', warrior = '${warrior}' where id = ${id} `;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.send(req.body);
  });
});

connection.connect((error) => {
  if (error) {
    console.log('error ' + error.message);
  }
  console.log('Con OK');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
