/**
 * Module dependencies.
 */
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var express = require('express');
var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});

/**
 * Create Express server.
 */
var app = express();

/**
 * Express configuration.
 */
if (app.get('env') === 'development') {
  app.use(logger('dev'));// log requests to the console.
}

// compress all requests
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));// to support URL-encoded bodies.
app.use(bodyParser.json());// to support JSON-encoded bodies.
app.use(function(req, res, next) {// Allow cors
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/**
 * Start Express server.
 */
var server = app.listen(3000, function() {
  console.log('Post server listening on port %d in %s mode.', 3000, app.get('env'));
});
