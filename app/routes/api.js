var mysql = require("mysql");
function REST_ROUTER(router,connection,md5,app) {
  var self = this;
  self.handleRoutes(router,connection,md5,app);
}
// used for duplicate endpoints: PUT `/api/users` & PUT `/api/password-reset`
function passwordReset(req, res, next, connection, md5, app) {
  var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
  var table = ["users","password",md5(req.body.password),"email",req.body.email];
  query = mysql.format(query,table);
  connection.query(query,function(err,rows){
    if(err) {
      meJSON = {"Error" : true, "Message" : "Error executing MySQL query. "};
      res.json(meJSON);
      app.errorLogger.error(meJSON.Message+err);
    } else {
      meJSON = {"Error" : false, "Message" : "Updated the password for email "+req.body.email};
      res.json(meJSON);
      app.errorLogger.info(meJSON.Message);
    }
  });
}
// TODO: POST `/api/request-token` endpoint required: email/password
REST_ROUTER.prototype.handleRoutes = (router,connection,md5,app) => {
  // API home routes
  router.route("/")
    .get((req, res) => {
      var msg = {
        description: "This is a list of available endpoints and documentation.",
        "API Endpoints":  {
          User: {
            create: { POST: app.baseUrl + "/api/users/" },
            read: { GET: app.baseUrl + "/api/user/:id" },
            update: [{ PUT: app.baseUrl + "/api/user/:id" }, { PUT: app.baseUrl + "/api/password-reset/:id" }],
            delete: { DELETE: app.baseUrl + "/api/user/:id" },
            index: { GET: app.baseUrl + "/api/users/" }
          }
        },
        "API Documentation": {
          User: {
            create: { POST: app.baseUrl + "/docs/users/" },
            read: { GET: app.baseUrl + "/docs/user/:id" },
            update: [{ PUT: app.baseUrl + "/docs/users/" }, { PUT: app.baseUrl + "/docs/password-reset/" }],
            delete: { DELETE: app.baseUrl + "/docs/user/:id" },
            index:{ GET: app.baseUrl + "/docs/users/" }
          }
        }
      };
      res.json({ Error: false, Message: msg });
    });
  // User routes
  var userRoutes = require("./api/users")(router,connection,md5,app);
  
}
module.exports = REST_ROUTER;