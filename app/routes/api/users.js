const mailer = require('nodemailer');
var mysql = require("mysql");
// create reusable transporter object using the default SMTP transport
var gmail = mailer.createTransport({
    service: 'gmail', // for gmail, use an application password: https://myaccount.google.com/apppasswords
    auth: require('../../config/email.json')
});

// TODO: POST `/api/request-token` endpoint required: email/password

// used for duplicate endpoints: PUT `/api/users` & PUT `/api/password-reset`
function sendPass(pass,email) {
  return {
          from: '"Jeremy Bradbury" <jdbradbury@gmail.com>', // sender address
          to: email, // account to update
          subject: 'Important account update', // Subject line
          text: 'Your password is:\r\n'+pass, // plain text body
          html: 'Your password is:<br><b>'+pass+'</b>' // html body
      };
}
module.exports = function(router,connection,md5,app) {
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
            meJSON = {"Error" : false, "Message" : "User created!"};
            res.json(meJSON);
            app.errorLogger.info(meJSON.Message);
          }
      });
    });
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
          meJSON = {"Error" : false, "Message" : "Deleted User: "+req.params.id};
          res.json(meJSON);
          app.errorLogger.info(meJSON.Message);
        }
      });
    });
  router.route("/password-reset")
    .put((req, res, next) => { // Update User password by email Endpoint
      var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      var pass = app.newPass();
      var email = sendPass(pass,req.body.email);
      gmail.sendMail(email, function(err,info){
        if(err) {
          var meJSON = {"Error" : true, "Message" : "Email Error: "};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message,err+"\r\n"+info);
        } else {
          // TODO: replace md5 with bcryptjs
          var table = ["users","password",md5(pass),"email",req.body.email];
          query = mysql.format(query,table);
          connection.query(query,function(err,rows){
            if(err) {
              var meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
              res.json(meJSON);
              app.errorLogger.error(meJSON.Message+err);
            } else {
              var meJSON = {"Error" : false, "Message" : "Check your email! We've sent a password for: "+req.body.email};
              res.json(meJSON);
              app.errorLogger.info(meJSON.Message);
            } 
          })
        }
      });     
    }); 
  return this;
}