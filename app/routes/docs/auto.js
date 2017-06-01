module.exports = function(router,connection,app) {
  // auto docs routes
  router.route("/*s")
    .get((req, res, next) => { // Index objects (no limit set... yet)
      var cache = require("../../cache/amc.json");
      var obj = req.params[0];
      var table = "api_"+obj;
      if (table in cache) {
        var columns = cache[table];
        var msg = {
          description: "This is the "+obj+" Index. It lists all "+obj+"s without limit/offset... yet.",
          endpoint: "[GET: " + app.baseUrl + "/api/"+obj+"s]",
          type: "Index",
          columns: columns
        };
        res.json({ Error: false, Message: msg });
        app.errorLogger.info(msg.endpoint.replace('/api/','/docs/'));
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    })
    .post((req, res, next) => { // Create new object
      var cache = require("../../cache/amc.json");
      var obj = req.params[0];
      var table = "api_"+obj;
      if (table in cache) {
        var columns = cache[table];
        var msg = {
          description: "This Creates a single "+obj+" record. All body parameters are optional and only the data provided is added. If nothing is provided only "+obj+"_id is set.",
          endpoint: "[POST: " + app.baseUrl + "/api/"+obj+"s]",
          type: "Create",
          columns: columns
        };
        res.json({ Error: false, Message: msg });
        app.errorLogger.info(msg.endpoint.replace('/api/','/docs/'),req.body);
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    });
  router.route("/*/:id")
    .get((req, res, next) => { // Read object by id Endpoint
      var cache = require("../../cache/amc.json");
      var obj = req.params[0];
      var table = "api_"+obj;
      if (table in cache) {
        var columns = cache[table];
        var msg = {
          description: "Single "+obj+" record lookup and read.",
          endpoint: "[GET: " + app.baseUrl + "/api/"+obj+"/:"+obj+"_id]",
          type: "Read",
          columns: columns
        };
        res.json({ Error: false, Message: msg });
        app.errorLogger.info(msg.endpoint.replace('/api/','/docs/'));
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    })
    .put((req, res, next) => { // Update object by id Endpoint
      var cache = require("../../cache/amc.json");
      var obj = req.params[0];
      var table = "api_"+obj;
      if (table in cache) {
        var columns = cache[table];
        var msg = {
          description: "This Updates a single "+obj+" record. All body parameters are optional and only the data provided is updated. However, if nothing is provided nothing can be updated.",
          endpoint: "[PUT: " + app.baseUrl + "/api/"+obj+"/:"+obj+"_id]",
          type: "Update",
          columns: columns
        };
        res.json({ Error: false, Message: msg });
        app.errorLogger.info(msg.endpoint.replace('/api/','/docs/'),req.body);
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    })
    .delete((req, res, next) => { // Delete object by id Endpoint
      var cache = require("../../cache/amc.json");
      var obj = req.params[0];
      var table = "api_"+obj;
      if (table in cache) {
        var columns = cache[table];
        var msg = {
          description: "Single "+obj+" record delete.",
          endpoint: "[DELETE: " + app.baseUrl + "/api/"+obj+"/:"+obj+"_id]",
          type: "Delete",
          columns: columns
        };
        res.json({ Error: false, Message: msg });
        app.errorLogger.info(msg.endpoint.replace('/api/','/docs/'));
      } else {
        meJSON = {"Error" : true, "Message" : "Object: "+table+" not found."};
        res.json(meJSON);
        app.errorLogger.error(meJSON.Message);
      }
    });
  return this;
}