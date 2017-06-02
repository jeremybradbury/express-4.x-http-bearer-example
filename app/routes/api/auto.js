var mysql = require("mysql");
module.exports = function(router,connection,app) {
  // auto api routes
  router.route("/*s")
    .get((req, res, next) => { // Index objects (no limit set... yet)
      var cache = require("../../cache/amc.json");
      var table = "api_"+req.params[0];
      if (table in cache) {
        var query = "SELECT * FROM ??";
        table = [table];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
          if(err) {
            meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
            res.json(meJSON);
            app.errorLogger.error(meJSON.Message,err);
          } else {
            meJSON = {"Error" : false, "Message" : {}}
            meJSON.Message[req.params[0]+"s"] = rows;
            res.json(meJSON);
            app.errorLogger.info(rows);
          }
        }); 
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    })
    .post((req, res, next) => { // Create new object
      var cache = require("../../cache/amc.json");
      var obj = "api_"+req.params[0];
      if (obj in cache) {
        var query = "INSERT INTO ?? ";
        var table = [obj];
        if(Object.keys(req.body).length > 0){
          query += "(??";
          var values = "(?";
          var key = Object.keys(req.body)[0];
          table = table.concat([key]);
          var aVals = [req.body[key]];
          for (var i = 1, len = Object.keys(req.body).length; i < len; i++) {
            query += ", ??";
            values += ", ?";
            key = Object.keys(req.body)[i];
            aVals = aVals.concat([req.body[key]]);
            table = table.concat([key]);
          }
          table = table.concat(aVals);
          query += ") values "+values+");";
          query = mysql.format(query,table);
          console.log(query);
          connection.query(query,function(err,rows){
            if(err) {
              meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
              res.json(meJSON);
              app.errorLogger.error(meJSON.Message,err);
            } else {
              meJSON = {"Error" : false, "Message" : {}}
              meJSON.Message[req.params[0]] = rows;
              res.json(meJSON);
              app.errorLogger.info(rows);
            }
          }); 
        } else {
          meJSON = {"Error" : true, "Message" : "Nothing to add."};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message);
        }
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    });
  router.route("/*/:id")
    .get((req, res, next) => { // Read object by id Endpoint
      var cache = require("../../cache/amc.json");
      var obj = "api_"+req.params[0];
      if (obj in cache) {
        var id = req.params[0]+"_id";
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = [obj,id,req.params.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
          if(err) {
            meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
            res.json(meJSON);
            app.errorLogger.error(meJSON.Message,err);
          } else {
            meJSON = {"Error" : false, "Message" : {}}
            meJSON.Message[req.params[0]] = rows;
            res.json(meJSON);
            app.errorLogger.info(rows);
          }
        }); 
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    })
    .put((req, res, next) => { // Update object by id Endpoint
      var cache = require("../../cache/amc.json");
      var obj = "api_"+req.params[0];
      if (obj in cache) {
        var query = "UPDATE ?? ";
        var table = [obj];
        var id = req.params[0]+"_id";
        if(Object.keys(req.body).length > 0){
          query += "SET ??=?";
          var key = Object.keys(req.body)[0];
          table = table.concat([key,req.body[key]]);
          if(Object.keys(req.body).length > 1){
            for (var i = 1, len = Object.keys(req.body).length; i < len; i++) {
              query += ", ??=?";
              var key = Object.keys(req.body)[i];
              table = table.concat([key,req.body[key]]);
            }
          }
          query += " WHERE ??=?;";
          table = table.concat([id,req.params.id]);
          query = mysql.format(query,table);
          connection.query(query,function(err,rows){
            if(err) {
              meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
              res.json(meJSON);
              app.errorLogger.error(meJSON.Message,err);
            } else {
              meJSON = {"Error" : false, "Message" : {}}
              meJSON.Message[req.params[0]] = rows;
              res.json(meJSON);
              app.errorLogger.info(rows);
            }
          }); 
        } else {
          meJSON = {"Error" : true, "Message" : "Nothing to update."};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message);
        }
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    })
    .delete((req, res, next) => { // Delete object by id Endpoint
      var cache = require("../../cache/amc.json");
      var obj = "api_"+req.params[0];
      if (obj in cache) {
        var id = req.params[0]+"_id";
        var query = "DELETE FROM ?? WHERE ??=?";
        var table = [obj,id,req.params.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
          if(err) {
            meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
            res.json(meJSON);
            app.errorLogger.error(meJSON.Message,err);
          } else {
            meJSON = {"Error" : false, "Message" : {}}
            meJSON.Message[req.params[0]] = rows;
            res.json(meJSON);
            app.errorLogger.info(meJSON.Message,rows);
          }
        }); 
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    });
  return this;
}