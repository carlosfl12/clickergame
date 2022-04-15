const express = require('express');
const { default: axios } = require('axios');
const app = express();
const port = 3000;
const enemigos = require('./routes/database');
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});
app.use('/enemies', enemigos);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function getResults() {
  const url = 'http://localhost:3000/enemies';

  const response = await axios.get(url);

  console.log(response.data);
}

getResults();
