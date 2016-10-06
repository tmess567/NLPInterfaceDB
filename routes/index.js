var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Express' });
  res.sendfile(path.resolve('public/static/web-speech-api/index.html'));
});

module.exports = router;
