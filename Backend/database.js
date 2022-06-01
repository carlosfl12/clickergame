const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const app = express();

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
  res.send('Data saved');
  //This to save data every 30 min or save
});

app.put('/update/:id', (req, res) => {
  res.send('Update enemy');
});

connection.connect((error) => {
  if (error) {
    console.log('error ' + error.message);
  }
  console.log('Con OK');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
