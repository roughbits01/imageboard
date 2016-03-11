'use strict';

/**
 * Module dependencies.
 */
var compress = require('compression');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var authorize = require('./middlewares/validation');
var users = require('./routes/users');
var boards = require('./routes/boards');
var threads = require('./routes/threads');
var posts = require('./routes/posts');
var config = require("./config.json");
var express = require('express');
var crypto = require('crypto');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.database.url);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure MongoDB is running.');
});

/**
 * Express configuration.
 */
app.use(logger('dev'));// log requests to the console.
app.use(bodyParser.json());// to support JSON-encoded bodies.
app.use(bodyParser.urlencoded({ extended: true }));// to support URL-encoded bodies.
app.use(compress());// gzip/deflate outgoing responses.
app.use(validator());
app.disable('x-powered-by');
//app.use('/api/users', authorize(['mod']));
app.use('/users', users);
app.use('/boards', boards);
app.use('/threads', threads);
app.use('/posts', posts);
app.set('port', process.env.PORT || 3000);

exports.createToken = function(callback) {
  crypto.randomBytes(32, function(ex, token) {
    if (ex) callback(ex);

    if (token) callback(null, token.toString('hex'));
    else callback(new Error('Problem when generating token'));
  });
};


/**
 * Start Express server.
 */
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode.', app.get('port'), app.get('env'));
});
