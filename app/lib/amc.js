var mysql = require('mysql');
var fs = require('fs');
module.exports = function(connection, cacheDirectory, cb) {
  var query = "SELECT ?? as ?, ?? as ?, ?? as ? from ??.?? WHERE ?? = ? AND (?? LIKE ?);";
  var table = ["TABLE_NAME","table","COLUMN_NAME","column","COLUMN_TYPE","type","information_schema","COLUMNS","TABLE_SCHEMA","restful_api","TABLE_NAME","api_%"];
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
            // var col = {};
            // col[row.column] = row.type;
            tables[row.table] = [row.column];
          } else {
            // keep stacking
            tables[row.table].push(row.column);
          }
        }
        var json = JSON.stringify(tables);
        fs.writeFile(cacheDirectory+'/amc.json',json,'utf8',cb);
      });
    }
  });
}