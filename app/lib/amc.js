var mysql = require('mysql');
var fs = require('fs');
module.exports = function(connection, cacheDirectory, cb) {
  var query = "SELECT ?? as ?, ?? as ?, ?? as ?, ?? as ?, ?? as ?, ?? as ? from ??.?? WHERE ?? = ? AND (?? LIKE ?);";
  var table = ["TABLE_NAME","table","COLUMN_NAME","column","DATA_TYPE","type","CHARACTER_MAXIMUM_LENGTH","length","IS_NULLABLE","nullable","COLUMN_DEFAULT","default","information_schema","COLUMNS","TABLE_SCHEMA","restful_api","TABLE_NAME","api_%"];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(rows) {
      var tables = {};
      process.nextTick(function() {
        for (var i = 0, len = rows.length; i < len; i++) {
          var row = rows[i];
          var lastRow = (i > 0) ? rows[i-1] : '';
          if(lastRow == '' || row.table != lastRow.table ){
            // first column of table
            tables[row.table] = [{name:row.column,"data-type":row.type,"max-chars":row.length,"nullable":row.nullable,"default":row.default}];
          } else {
            // keep stacking
            tables[row.table].push({name:row.column,"data-type":row.type,"max-chars":row.length,"nullable":row.nullable,"default":row.default});
          }
        }
        var json = JSON.stringify(tables);
        fs.writeFile(cacheDirectory+'/amc.json',json,'utf8',cb);
      });
    }
  });
}