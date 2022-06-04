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
  username = req.body.username;
  const sql = `Insert into player SET ?`;
  const playerSettings = {
    name: username,
    level: 1,
    health: 200,
    damage: 10,
    wizard: 0,
    warrior: 0,
  };
  console.log(username);
  // ARREGLAR ESTO
  connection.query(
    `SELECT name from player where name = '${username}' LIMIT 1`,
    (err, res) => {
      res.forEach((rowName) => {
        console.log(rowName.name);
        if (rowName.name == username) return;
        else {
          connection.query(sql, playerSettings, (err) => {
            if (err) throw err;
          });
        }
      });
    }
  );
  // connection.query(sql, playerSettings, (err) => {
  //   if (err) throw err;
  // });

  res.sendFile(path.join(__dirname + '/../index.html'));
});

// app.listen(3000);

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

// app.post('/save', (req, res) => {
//   console.log(username);
//   // res.send('Data saved');
//   const sql = 'Insert into player SET ?';
//   const playerSettings = {
//     name: username,
//     level: req.body.level,
//     health: req.body.health,
//     damage: req.body.damage,
//     wizard: req.body.wizard,
//     warrior: req.body.warrior,
//   };

//   // res.send(req.body.allies.wizard);

//   connection.query(sql, playerSettings, (err) => {
//     if (err) throw err;

//     res.send('Data saved');
//   });
//   //This to save data every 30 min or save
// });

app.get('/username', (req, res) => {
  const sql = `Select name from player where name = '${username}'`;
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
