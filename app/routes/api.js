var mysql = require("mysql");
function REST_ROUTER(router,connection,md5,app) {
    var self = this;
    self.handleRoutes(router,connection,md5,app);
}
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
// TODO: token generatoion endpoint using POST email/password

REST_ROUTER.prototype.handleRoutes = (router,connection,md5,app) => {
    // api routes
    router.route("/")
        .get((req, res) => {
            var msg = {
                description: "This is a list of available endpoints and documentation.",
                endpoints:  {
                    User: {
                        create: { POST:   app.baseUrl + "/api/users/" },
                        read:   { GET:    app.baseUrl + "/api/user/:id" },
                        update: { PUT:    app.baseUrl + "/api/user/:id" },
                        delete: { DELETE: app.baseUrl + "/api/user/:id" },
                        index:  { GET:    app.baseUrl + "/api/users/" }
                    }
                }
            };
            res.json({ Error: false, Message: msg });
    });
    router.route("/users")
        .get((req, res, next) => { // Index
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
        .post((req, res, next) => { // Create
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
        .put((req, res, next) => { passwordReset(req,res,next,connection,md5,app) }); // Update
    router.route("/user/:id")
        .get((req, res, next) => { // Read
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
        .delete((req, res, next) => { // Delete
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
        .put((req, res, next) => { passwordReset(req,res,next,connection,md5,app) }); // Update
}

module.exports = REST_ROUTER;