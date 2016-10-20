const $ = require('jquery');
var connection = require("../NID/mysql-connector.js");
var tableMentions = function(){this.arr = [];};

tableMentions.prototype.addMention = function(tableName){
	//Not allow duplicate
	if(this.arr.indexOf(tableName)<0)
		this.arr.push(tableName);
}


function rankTables(tableMentions, tableMentionOrigin, originalTableMention, callback){
	var score = new Array(originalTableMention.length+1).join('0').split('');
	console.log(tableMentions);
	let notMentioned = [], notMentionedOrig = [];
	var count2 = 0;
	tableMentions.forEach(function(table, tableIndex){
		let query = "SELECT TABLE_SCHEMA FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE = 'FOREIGN KEY' AND TABLE_NAME = '"
			+table+"';";
		count2++;
		connection.query(query, function(err, rows, fields){
			//console.log(rows);

			//GET TABLENAME FROM QUERY
			let queryArr = query.split(" ");
			let dirtyTableName = queryArr[queryArr.length-1];
			let tableName = dirtyTableName.substring(1,dirtyTableName.length-2);

			//console.log("TABLE="+tableName);
			//console.log("FKNUM="+rows.length);

			rows.forEach(function(FK, FKindex){
				FK = FK.TABLE_SCHEMA;
				if(originalTableMention.indexOf(FK)>=0){
					score[originalTableMention.indexOf(tableName)]++;
				} else {
					notMentioned.push(FK);
					notMentionedOrig.push(tableName);
				}
				count2--;
				if(count2<=0){
					console.log("called");
					callback(score);
				}
			});
		});
	});
	//score = rankTables(notMentioned, notMentionedOrig, originalTableMention);
	callback(score);
}


module.exports.rank = function(queryContenderSchema, callback){
	let TableMentions = new tableMentions();
	//Populating TableMentions
	for(let keyword in queryContenderSchema){
		let queryContenders = queryContenderSchema[keyword];
		if(Object.prototype.toString.call(queryContenders) === '[object Array]'){
			queryContenders.forEach(function(queryContender, queryContenderIndex){
				if(queryContender.tableMention !== undefined)
					TableMentions.addMention(keyword);
				else if(queryContender.columnMention !== undefined){
					queryContender.columnMention.forEach(function(val, index){
						TableMentions.addMention(val);
					});
				}
				else if(queryContender.fieldMention !== undefined){
					queryContender.fieldMention.forEach(function(fieldMention,fieldMentionIndex){
						TableMentions.addMention(fieldMention.tableName);
					});
				}
			});
		}
	}
	rankTables(TableMentions.arr, TableMentions.arr, TableMentions.arr, callback);
};