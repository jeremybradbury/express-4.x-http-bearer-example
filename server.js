var express = require('express');
var mysql = require("mysql"), md5 = require('MD5'), rest = require("./app/routes/api.js");
var fs = require('fs'), path = require('path'), bodyParser = require('body-parser');
var passport = require('passport'), Strategy = require('passport-http-bearer').Strategy, https = require('https');
var db = require('./app/db');
var rfs = require('rotating-file-stream'), accessLogger = require('morgan'), winston = require('winston');

passport.use(new Strategy(
  (token, cb) => {
    db.users.findByToken(token, (err, user) => {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
}));

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // bodyParser() will let us get the data from a POST

function REST(){
    var self = this;
    self.connectMysql();
};

// log access
var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); // ensure log directory exists
var accessLogStream = rfs('access.log', { // create a rotating write stream
  size:     '10M', // rotate every 10 MB written
  compress: 'gzip', // compress rotated files
  path: logDirectory
});
accessLogger.token('remote-user', (req) => {
    if(req.user){
        return req.user.username; // ignore basic HTTP auth user replace with token owner 
    } else {
        return "aNonUser"; // anonymous login no auth endpoints (like docs)
    }
});
app.accessLogger = accessLogger;
app.use(accessLogger('combined', {stream: accessLogStream})); // morgan likes to log to a rotating file
 // log errors
var errorLogger = new winston.Logger({
    transports: [
        new winston.transports.File({ // winston likes to log to a rotating file too
            level: 'info', //  error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
            filename: './log/error.log',
            handleExceptions: true,
            json: false,
            maxsize: 10485760, //10MB
            zippedArchive: true,
            colorize: false
        }),
        new winston.transports.Console({ // winston also likes to log to stdout
            level: 'info', //  error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});
module.exports = errorLogger;
module.exports.stream = {
    write: (message, encoding) => {
        errorLogger.info(message);
    }
};
app.errorLogger = errorLogger;

REST.prototype.connectMysql = () => {
    var self = this;
    var pool = mysql.createPool(require('./app/config/database.json'));
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = (connection) => {
    var self = this;
    Auth = passport.authenticate('bearer', { session: false });
    app.baseUrl = 'https://localhost:3443';
    var router = express.Router();
    app.use('/api', Auth, router);
    var rest_router = new rest(router,connection,md5,app);
    self.startServer();
}

REST.prototype.startServer = () => {
    https.createServer({ key: fs.readFileSync('./https/key.pem'), cert: fs.readFileSync('./https/cert.pem') }, app)
    .listen(3443, function () {
        app.errorLogger.info('Secure Server listening on port 3443');
    });
}

REST.prototype.stop = (err) => {
    app.errorLogger.error("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();