const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/main', (req, res, next) => {
  res.render('main', {});
});

router.get('/info', (req, res, next) => {
  res.render('info', {});
});

module.exports = router;
