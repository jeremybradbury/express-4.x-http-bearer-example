const mailer = require('nodemailer');
var mysql = require("mysql");
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
  router.route("/password")
    .put((req, res, next) => { // Password reset by email Endpoint
      var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      var pass = app.newPass();
      var email = sendPass(pass,req.body.email);
      gmail.sendMail(email, function(err,info){
        if(err) {
          var meJSON = {"Error" : true, "Message" : "Email Error: "};
          res.json(meJSON);
          app.errorLogger.error(meJSON.Message+err,info);
        } else {
          bcrypt.hash(pass, 12, function(err, hash) {
            var table = ["users","password",hash,"email",req.body.email];
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
          });
        }
      });     
    }); 
  return this;
}