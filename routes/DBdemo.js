const express = require('express');
const router = express.Router();

const ExhaustiveSearcher = require("../NID/exhaustive-search");
const querySchemaGen = require("../NID/query-contender-schema.js");
const queryRanker = require("../NID/query-ranker.js");

router.get('/', function(req, res) {
  let queryContenderSchema = querySchemaGen.nullSchema();
  html = "<html><head><script src='https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js'></script></head><body>"
  
  result = ExhaustiveSearcher(req, function(output){
    /*queryRanker.rank(output, function(score){
      html += JSON.stringify(score-, null, 5); + "</body></html>";
      res.send(html);
      console.log("Sent result");
    });*/
    html += "Keywords: "+req.query.query+"<br/>";
    html += JSON.stringify(output, null, 5); + "</body></html>";
    res.send(html);
  }, queryContenderSchema);
  
});

module.exports = router;

