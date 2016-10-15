var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '128.199.203.97',
  user     : 'remote',
  password : 'Gmail@123',
  database : 'world'
});

router.get('/', function(req, res) {
  connection.connect();

  connection.query('SELECT * from city', function(err, rows, fields) {
  if (!err)
    res.send('The solution is: ', rows);
  else
    console.log(err);
  });

  connection.end();

});

module.exports = router;

