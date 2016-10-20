var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '128.199.203.97',
  user     : 'remote',
  password : 'Gmail@123',
  database : 'world'
});
connection.connect();
module.exports = connection;