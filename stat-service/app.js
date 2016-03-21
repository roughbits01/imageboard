/**
 * Module dependencies.
 */
var logger = require('morgan');
var config = require("./config.json");
var redis = require('redis');
var express = require('express');

/**
 * Create Express server.
 */
var app = express();

/**
 * Create redis client.
 */
 var client = redis.createClient();

/**
 * Express configuration.
 */
if (app.get('env') === 'development') {
  app.use(logger('dev'));// log requests to the console.
}

//GET /stats
app.get('/stats', function(req, res) {
  client.get('requests', function(err, count) {
    if (err) {
      console.log("error: " + err);
    } else {
      res.json({
        requests: {
          active: parseInt(count),
          total: 10000000
        },
        posts: {
          active: 200000,
          total: 10000000
        },
        users: {
          active: 2000,
          total: 100000
        },
        servers: [
          { name: 'users', status: 'UP' },
          { name: 'posts', status: 'UP' },
          { name: 'upload', status: 'UP' },
          { name: 'authentication', status: 'UP' }
        ]
      });
    }
  });
});

/**
 * Start Express server.
 */
var server = app.listen(3002, function() {
  console.log('Statistics server listening on port %d in %s mode.', 3002, app.get('env'));
});
