const mailer = require('nodemailer');
var mysql = require("mysql");
var crypto = require('crypto'), bcrypt = require('bcryptjs');
var genToken = require("../../lib/token-gen"), newPass = require("../../lib/xpg");
var gmail = mailer.createTransport({
  service: 'gmail', // for gmail, use an application password: https://myaccount.google.com/apppasswords
  auth: require('../../config/email.json')
});
function sendPass(pass,email) {
  return {
    from: '"Jeremy Bradbury" <jdbradbury@gmail.com>', // sender address
    to: email, // account to update
    subject: 'Important account update', // Subject line
    text: 'Your password is:\r\n'+pass, // plain text body
    html: 'Your password is:<br><b>'+pass+'</b>' // html body
  };
}
module.exports = function(router,connection,app) {
  // api routes
  router.route("/users")
    .get((req, res, next) => { // Index Users (no limit set... yet)
      var query = "SELECT ??, ?? FROM ??";
      var table = ["user_id","email","user"];
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
      var pass = newPass();
      var email = sendPass(pass,req.body.email);
      gmail.sendMail(email, function(err,info){
        if(err) {
          var meJSON = {"Error" : true, "Message" : "Error senfing email. "};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message + err, info);
        } else {
          bcrypt.hash(pass, 12, function(err, hash) {
            var table = ["user","email","password",req.body.email,hash];
            query = mysql.format(query,table);
            connection.query(query,function(err,rows){
              if(err) {
                meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
                res.json(meJSON);
                app.errorLogger.error(meJSON.Message+err);
              } else {
                var meJSON = {"Error" : false, "Message" : "Check your email! We sent a new password to: "+req.body.email};
                res.json(meJSON);
                app.errorLogger.info(meJSON.Message);
              }
            });
          });
        }
      });
    });
  router.route("/user/:id")
    .get((req, res, next) => { // Read User by id Endpoint
      var query = "SELECT * FROM ?? WHERE ??=?";
      var table = ["user","user_id",req.params.id];
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
      var table = ["user","user_id",req.params.id];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
        if(err) {
          meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message+err);
        } else {
          meJSON = {"Error" : false, "Message" : "Deleted User: "+req.params.id};
          res.json(meJSON);
          app.errorLogger.info(meJSON.Message);
        }
      });
    });
  router.route("/password-reset")
    .put((req, res, next) => { // Update User password by email Endpoint
      var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      var pass = newPass();
      var email = sendPass(pass,req.body.email);
      gmail.sendMail(email, function(err,info){
        if(err) {
          var meJSON = {"Error" : true, "Message" : "Error senfing email. "};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message+ err, info);
        } else {
          bcrypt.hash(pass, 12, function(err, hash) {
            var table = ["user","password",hash,"user_id",req.user.user_id];
            query = mysql.format(query,table);
            connection.query(query,function(err,rows){
              if(err) {
                var meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
                res.json(meJSON);
                app.errorLogger.error(meJSON.Message+err);
              } else {
                var meJSON = {"Error" : false, "Message" : "Check your email! We sent a new password to: "+req.body.email};
                res.json(meJSON);
                app.errorLogger.info(meJSON.Message);
              } 
            })
          });
        }
      });     
    }); 
  router.route("/user/token")
    .put((req, res, next) => { // Update auth token with current auth token
      var token = genToken();
      var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      var table = ["user_token","token",token,"token",req.user.token];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
        if(err) {
          var meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message+err);
        } else {
          var meJSON = {"Error" : false, "Message" : "This is your new token. Save it now! It will be needed for all future requests!","Token":token};
          res.json(meJSON);
          app.errorLogger.info(meJSON.Message);
        } 
      })
    });    
  return this;
}