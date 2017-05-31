var mysql = require("mysql");
var userAuth = require("../../lib/user-auth");
var genToken = require("../../lib/token-gen");
module.exports = function(router,connection,app) {
  router.route("/token")
    .post((req, res, next) => { // Check password and email Endpoint
      userAuth(connection, req, function(err,user){
        if(!err){
          var meJSON = {"Error" : false, "Message" : user.email+" found."};
          res.json(meJSON);
          app.errorLogger.info(meJSON.Message);
        } else {
          var meJSON = {"Error" : true, "Message" : err};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message);
        }
      });
    })
    .put((req, res, next) => { // generate/reset token by email/password Endpoint
      userAuth(connection, req, function(err,user){ // email/password body params required
        if(err){
          var meJSON = {"Error" : true, "Message" : err};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message);
        } else {
          var token = genToken();
          // Upsert
          if(user.token != null){ // Update 
            var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
            var table = ["user_tokens","token",token,"user_id_fk",user.id];
          } else { // Create
            var query = "INSERT INTO ??(??,??) VALUES (?,?)";
            var table = ["user_tokens","token","user_id_fk",token,user.id];
          }
          query = mysql.format(query,table);
          connection.query(query,function(err,rows){
            if(err) {
              var meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
              res.json(meJSON);
              app.errorLogger.error(meJSON.Message+err);
            } else {
              var meJSON = {"Error" : false, "Message" : "This is your new token. Save it now! It is needed for all API requests!","Token":token};
              res.json(meJSON);
              app.errorLogger.info(meJSON.Message);
            } 
          });
        }
      });
    }); 
  return this;
}