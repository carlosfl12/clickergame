const express = require('express');
const router = express.Router();
const enemigos = require('../services/database');

router.get('/', async function (req, res, next) {
  try {
    res.json(
      await [
        {
          name: 'Pepe',
          health: 100,
          damage: 30,
        },
        {
          name: 'Jose Juan',
          health: 100,
          damage: 30,
        },
      ]
    );
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
    next(err);
  }
});

module.exports = router;
