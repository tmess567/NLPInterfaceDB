var _ = require('underscore');

var genObj = function(){};
genObj.prototype.addKeyword = function(keyword){
	if(this[keyword] !== undefined)
		this[keyword] = [];
},
genObj.prototype.addMention = function(keyword, mentionobj){
	if(!this.hasMention(keyword, mentionobj)){
		if(this[keyword] !== undefined)
			this[keyword].push(mentionobj);
		else if(this[keyword] === undefined)
			this[keyword] = [mentionobj];
		return this;
		}
},
genObj.prototype.hasMention = function(keyword, mentionobj){
	var flag = false;
	for(var keywordLooper in this){
		if(keywordLooper  === keyword){
			this[keywordLooper].forEach(function(mention, mentionIndex){
				if(_.isEqual(mention, mentionobj)) {
					//NEED TO DEBUG
					//JS is unable to return from here so I am using flag
					flag = true;
				}
			});
		}
	}
	return flag;
}

module.exports.initSchema = function(keyword, mentionarr) {
    returnObj = new genObj();
    returnObj[keyword] = mentionarr;
    return returnObj;
}
module.exports.emptySchema = function(keyword) {
    returnObj = new genObj();
    returnObj[keyword] = [];
    return returnObj;
}
module.exports.nullSchema = function() {
    returnObj = new genObj();
    return returnObj;
}

