var express = require('express');
var router = express.Router();
var util = require('util')
var exec = require('child_process').exec;

/* GET users listing. */
router.get('/', function(req, res) {
  exec('cd /root/models/syntaxnet && echo "'+req.query.query+'" | syntaxnet/demo.sh', function(error, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    res.send(stdout);
  });
  //res.send(req.query.query);
});

module.exports = router;
