var express = require('express');
var router = express.Router();
var Algorithmia = require('algorithmia');

var output = "", input = "", inputTokenized = [];
/* GET users listing. */
router.get('/', function(req, res) {
	input = req.query.query;
	inputTokenized = input.split(" ");
	Algorithmia.client("simCk/8Xru4qENyy96Cu8CFVx2c1")
           .algo("algo://ApacheOpenNLP/POSTagger/0.1.1")
           .pipe(input)
           .then(function(response) {
	    			console.log(response.get());
	    			outputArr = response.get()[0];
	    			keywords = [];
	    			output += JSON.stringify(outputArr);
	    			outputArr.forEach(function(tag, index){
		            	if(tag.startsWith("NN"))
		            		keywords.push(inputTokenized[index]);
		            });
		            var punctuationless = keywords.toString().replace(/[.\/#!?$%\^&\*;:{}=\-_`~()]/g,"");
					var finalString = punctuationless.replace(/\s{2,}/g," ");
	    			output += "<br/><a href='DBdemo?query="+finalString
	    				+"'>Connect to DB</a>";
	            	res.send(output);
    		});
});

module.exports = router;
