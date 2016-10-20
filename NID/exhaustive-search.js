var $ = require('jquery');

var connection = require("../NID/mysql-connector.js");

var queryContenderSchema = {};

var ExhaustiveSearcher = function(req, callback, queryContenderSchemaParam){
  queryContenderSchema = queryContenderSchemaParam;
  var query = "show tables;";
  var tables = {}, primaryKeyColumns = [];
  var keywords = req.query.query.split(",");
  connection.query(query, function(err, rows, fields) {
    if(rows!=undefined && rows.length>0){
      pushOutput = function(){callback(queryContenderSchema);};
      keywordSearchCallback = function(){searchForKeyword(keywords, tables, primaryKeyColumns, pushOutput);};
      columnSearchCallback = function(){pushSearchableColumns(rows, tables, primaryKeyColumns, keywordSearchCallback);};

      pushTableNames(rows, tables, primaryKeyColumns, columnSearchCallback);
    } else {
      console.log("No Tables to search");
    }
    
  });
};
function pushTableNames(tablesResult, tables, primaryKeyColumns, callback){
  tablesResult.forEach(function(tableNameRow, tableNameindex){
      var name_of_table = tableNameRow.Tables_in_world;
      tables[name_of_table] = [];
    });
  callback();
}

function pushSearchableColumns(tablesResult, tables, primaryKeyColumns, callback){
  var count = tablesResult.length;
  tablesResult.forEach(function(tableNameRow, tableNameindex){
      var query = "show columns from " + tableNameRow.Tables_in_world;
      connection.query(query, function(err, rows, fields) {
        var name_of_table = tableNameRow.Tables_in_world;
        pushSearchableColumnName(rows, name_of_table, tables, primaryKeyColumns);
        count--;
        if(count<=0) callback();
      });
  });
}

function pushSearchableColumnName(searchableColumnsResult, tableName, tables, primaryKeyColumns){
  searchableColumnsResult.forEach(function(searchableColumnRow, searchableColumnIndex){
    if(searchableColumnRow.Type.startsWith("char")){
      if(searchableColumnRow.Key !== 'PRI'){
        tables[tableName].push(searchableColumnRow.Field);
      } else {
        primaryKeyColumns.push(
          {
            "tableName": tableName,
            "columnName": searchableColumnRow.Field
          });
      }
    }
  });
}

function searchForKeyword(keywords, tables, primaryKeyColumns, callback){
    var count = 0;
    var output = [];

    var addToOutput = function(err, rows, fields) {
          if(rows!=undefined && rows.length>0){
            output.push(rows);
          }
          count --;
          if(count<=0) callback(output);
        };

    for(table in tables){
      keywords.forEach(function(keyword, kIndex){
        keyword = keyword.toLowerCase();


        //IF KEYWORD IS A TABLENAME
        if(keyword === table){
          count++;
          

          var query = "SELECT * from "+table;
          connection.query(query, function(err, rows, fields) {
            var mentionobj = {"tableMention" : 1};
            if(rows!=undefined && rows.length>0)
              queryContenderSchema.addMention(keyword, mentionobj);
            count --;
            if(count<=0) callback(output);
          });
        }


        //IF KEYWORRD IS A COLUMN NAME
        tables[table].forEach(function(columnName, columnIndex){
          if(columnName.toLowerCase() === keyword){
            count++;

            var query = "SELECT "+keyword+" from "+table;
            connection.query(query, function(err, rows, fields) {
              var mentionobj = {"columnMention": [table]};
              if(rows!=undefined && rows.length>0)
                queryContenderSchema.addMention(keyword, mentionobj);
              count --;
              if(count<=0) callback(output);
            });
          }
        });
        count ++;
        var columnList = tables[table].toString();

        var query = "SELECT * FROM " + table + " WHERE MATCH("+columnList+") AGAINST ('"
          +keyword+"' IN NATURAL LANGUAGE MODE);";
        connection.query(query, function(err, rows, fields) {
          let tableNameFromQuery = query.split(" ")[3];
          var mentionobj = {"fieldMention": [{"tableName": tableNameFromQuery,
             "columnName": columnList}]};
          if(rows!=undefined && rows.length>0){
            //TODO: figuring out which column has value
            queryContenderSchema.addMention(keyword, mentionobj);
          }
          count --;
          if(count<=0) callback();
        });


        primaryKeyColumns.forEach(function(primaryKeyColumn, primaryKeyColumnIndex){
          var query = "SELECT * FROM "+primaryKeyColumn.tableName+" WHERE "
            +primaryKeyColumn.columnName+" LIKE '"+keyword+"';";
          connection.query(query, function(err, rows, fields){
            let tableNameFromQuery = query.split(" ")[3];

            //GETTING COLUMN NAME FROM QUERY
            let queryArr = query.split(" ");
            let dirtyColumnName = queryArr[queryArr.length-1];
            let columnName = dirtyColumnName.substring(1,dirtyColumnName.length-2);

            var mentionobj = {"fieldMention": [{"tableName": tableNameFromQuery,
               "columnName": columnName}]};
            if(rows!=undefined && rows.length>0){
              //TODO: figuring out which column has value
              queryContenderSchema.addMention(keyword, mentionobj);
            }
            count --;
            if(count<=0) callback();
          });
        });


      });

      
    }
}
module.exports = ExhaustiveSearcher;