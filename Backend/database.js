const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const path = require('path');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(bodyParser.json());
app.disable('etag');
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../Frontend/css/')));
app.use(express.static(path.join(__dirname, '/../Frontend/img/')));
app.use(express.static(path.join(__dirname, '/../Frontend/scripts/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../login.html'));
});
let username = '';
app.post('/index', (req, res) => {
  let exists = false;
  username = req.body.username;
  const sql = `select name from player where name = "${username}" LIMIT 1`;
  const playerSettings = {
    name: username,
    level: 1,
    health: 200,
    damage: 10,
    wizard: 0,
    warrior: 0,
    stage: 0,
  };
  connection.query(sql, (err, res) => {
    res.length == 1 ? (exists = true) : (exists = false);

    if (exists) {
      return;
    } else {
      connection.query(`insert into player set ?`, playerSettings, (err) => {
        if (err) throw err;
      });
    }
  });

  res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/stats', (req, res) => {
  res.sendFile(path.join(__dirname + '/../stats.html'));
});

app.get('/playerdata', (req, res) => {
  const sql = `select * from player where name ='${username}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/playerstats', (req, res) => {
  const sql = `select * from stats where name = '${username}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post('/stats', (req, res) => {
  const sql = 'Insert into stats set ?';
  const now = new Date();
  const data = {
    name: username,
    clicks: req.body.clicks,
    cps: req.body.cps,
    score: req.body.score,
    date: now,
  };
  connection.query(sql, data, (err) => {
    if (err) throw err;
  });
});

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clickergame',
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
  const sql = 'SELECT * FROM enemies ORDER BY RAND() LIMIT 10';
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

app.get('/username', (req, res) => {
  const sql = `select name from player where name = "${username}" LIMIT 1`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    // if (result.length == 0) {
    //   res.send('NO RESULTS');
    // }
    res.json(result);
  });
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { level, health, damage, wizard, warrior, stage } = req.body;
  const sql = `update player set level = '${level}', health = '${health}', damage = '${damage}', wizard = '${wizard}', warrior = '${warrior}', stage = '${stage}' where id = ${id} `;

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
