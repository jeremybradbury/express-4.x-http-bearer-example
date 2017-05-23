function REST_ROUTER(router,connection,md5,app) {
  var self = this;
  self.handleRoutes(router,connection,md5,app);
}
REST_ROUTER.prototype.handleRoutes = (router,connection,md5,app) => {
  // docs routes
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
  // TODO: paging for User records
  router.route("/users")
    .get((req, res, next) => { // Index Users
      var msg = {
        description: "This is the User Index. It lists all users without limiting user count... yet.",
        endpoint: "[GET: " + app.baseUrl + "/api/users/]",
        type: "Index"
      };
      res.json({ Error: false, Message: msg });
    })
    .post((req, res, next) => { // Create new User
      var msg = {
        description: "This Creates a single record. All body parameters are optional and only the data provided is added. If nothing is provided only the id & created date are set.",
        endpoint: "[POST: " + app.baseUrl + "/api/users/]",
        type: "Create",
        postBodyParameters: {
          email:   { required: false, type: "string",  sample: "jeremy@example.com" },
          password:{ required: false, type: "string",  sample: "This is not actually a sample password, do not use it." },
        }
      };
      res.json({ Error: false, Message: msg });
    })
    .put((req, res, next) => { // Update User's password by email Documentation
      var msg = {
        description: "Updates a User's password by email record. Both body parameters are required, only the password for this record can/will change.",
        endpoint: "[PUT: " + app.baseUrl + "/api/users/]",
        type: "Create",
        postBodyParameters: {
          email:   { required: true, type: "string",  sample: "jeremy@example.com" },
          password:{ required: true, type: "string",  sample: "This is not really a sample password, do not use it." },
        }
      };
      res.json({ Error: false, Message: msg });
    });
  router.route("/user/:id")
    .get((req, res, next) => { // Read User by id Documentation
      var msg = {
        description: 'Single User lookup and Read.',
        endpoint: '[GET: ' + app.baseUrl + '/api/user/:id]',
        type: 'Read',
        getParameters: {
            id: { required: true, type: 'integer', sample: 2080 }
        }
      };
      res.json({ Error: false, Message: msg });
    })
    .delete((req, res, next) => { // Delete User by id Documentation
      var msg = {
        description: 'This is a single user delete.',
        endpoint: '[DELETE: ' + app.baseUrl + '/api/user/:id]',
        type: 'Delete',
        getParameters: {
          id: { required: true, type: 'integer', sample: 2080 }
        }
      };
      res.json({ Error: false, Message: msg });
    });
  router.route("/password-reset")
    .put((req, res, next) => { // Update password by email Documentation
      var msg = {
            description: "This Updates a user's password by email record. Both body parameters are required, only the password for this record can change.",
            endpoint: "[POST: " + app.baseUrl + "/api/users/]",
            type: "Create",
            postBodyParameters: {
                email:   { required: true, type: "string",  sample: "jeremy@example.com" },
                password:{ required: true, type: "string",  sample: "This is not really a sample password, do not use it." },
            }
        };
        res.json({ Error: false, Message: msg });
	  });
}
module.exports = REST_ROUTER;