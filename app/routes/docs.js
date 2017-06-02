function REST_ROUTER(router,connection,app) {
  var self = this;
  self.handleRoutes(router,connection,app);
}
REST_ROUTER.prototype.handleRoutes = (router,connection,app) => {
  // Docs home routes
  router.route("/")
    .get((req, res) => {
      var msg = {
        description: "This is a list of available endpoints and documentation. \r\nIf a call doesn't work for a particular endpoint, just change the folder from `/api` to `/docs`. \r\nThen you can read about the call and get your settings updated before changing it back to `/api`.",
      "API Endpoints":  {
        User: {
          create: { POST: app.baseUrl + "/api/users/" },
          read: { GET: app.baseUrl + "/api/user/:id" },
          update: [{ PUT: app.baseUrl + "/api/user/:id" }, { PUT: app.baseUrl + "/api/password-reset/:id" }],
          delete: { DELETE: app.baseUrl + "/api/user/:id" },
          index: { GET: app.baseUrl + "/api/users/" }
        }
      },
      "API Documentation":  {
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
  // Document User routes
  var userRoutes = require("./docs/users")(router,connection,app);
  // Document Auto Model routes. Remove or comment to disable and/or Override auto routing with specific models like for Users above this
  var autoRoutes = require("./docs/auto")(router,connection,app); // document auto routes for tables prefixed with `api_`  
}
module.exports = REST_ROUTER;