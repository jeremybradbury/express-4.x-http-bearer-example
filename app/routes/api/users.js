var mysql = require("mysql");
// TODO: POST `/api/request-token` endpoint required: email/password
module.exports = function(router,connection,md5,app) {
  var self = this;
  // api routes
  router.route("/users")
    .get((req, res, next) => { // Index Users (no limit set... yet)
      var query = "SELECT ??, ?? FROM ??";
      var table = ["id","email","users"];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
        if(err) {
          meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message+err);
        } else {
          meJSON = {"Error" : false, "Message" : "Success", "Users" : rows};
          res.json(meJSON);
          app.errorLogger.info(meJSON.Message,rows);
        }
      });
    })
    .post((req, res, next) => { // Create new User
      var query = "INSERT INTO ??(??,??) VALUES (?,?)";
      var table = ["users","email","password",req.body.email,md5(req.body.password)];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
            meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
            res.json(meJSON);
            app.errorLogger.error(meJSON.Message+err);
          } else {
            meJSON = {"Error" : false, "Message" : "User Added !"};
            res.json(meJSON);
            app.errorLogger.info(meJSON.Message);
          }
      });
    })
    .put((req, res, next) => { passwordReset(req,res,next,connection,md5,app) }); // Update password by email Endpoint
  router.route("/user/:id")
    .get((req, res, next) => { // Read User by id Endpoint
      var query = "SELECT * FROM ?? WHERE ??=?";
      var table = ["users","user_id",req.params.id];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
        if(err) {
          meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
          app.errorLogger.err(meJSON.Message+err);
          res.json(meJSON);
        } else {
          meJSON = {"Error" : false, "Message" : "Success", "Users" : rows};
          app.errorLogger.info(meJSON);
          res.json(meJSON);
        }
      });
    })
    .delete((req, res, next) => { // Delete User by id Endpoint
      var query = "DELETE from ?? WHERE ??=?";
      var table = ["users","user_id",req.params.id];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
        if(err) {
          meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message+err);
        } else {
          meJSON = {"Error" : false, "Message" : "Deleted the user "+req.params.id};
          res.json(meJSON);
          app.errorLogger.info(meJSON.Message);
        }
      });
    });
  router.route("/password-reset")
    .put((req, res, next) => { passwordReset(req,res,next,connection,md5,app) }); // Update password by email Endpoint
  return this;
}