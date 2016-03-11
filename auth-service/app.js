/**
 * Module dependencies.
 */
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler')
var User = require('./models/user');
var config = require("./config.json");
var express = require('express');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.database.url);

/**
 * Express configuration.
 */
app.use(bodyParser.urlencoded({ extended: true }));// to support URL-encoded bodies.

if (app.get('env') === 'development') {
  app.use(logger('dev'));// log requests to the console.
  app.use(errorHandler())
}

/**
 * Simple login: returns a JWT if login data is valid.
 */
app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message : 'Username and password required!' });
  } else {
    // Try to find a user we the given credentials selecting only the `hash` and `salt` fields.
    User.findOne({ email: username }, function(err, user) {
      if (err) return res.status(500).json({ message : 'Internal Server Error' });
      // If the credentials are valid we generate a token and dispatch it to the client.
      if(user) {
        console.log(user);
        user.comparePassword(password, function(err, matches) {
          if (err) return res.status(500).json({ message : 'Internal Server Error' });
          if (matches) return res.json({ token : user.generateToken() });
        });
      } else
      // Authenticating with invalid credentials will return 401 Unauthorized.
      return res.status(401).json({ message : 'Invalid username or password!' });
    });
  }
});

/**
 * Start Express server.
 */
var server = app.listen(3001, function() {
  console.log('Authentication server listening on port %d in %s mode.', 3001, app.get('env'));
});
