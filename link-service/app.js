/**
 * Module dependencies.
 */
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var express = require('express');
var request = require("request");

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
//app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));// to support URL-encoded bodies.
app.use(bodyParser.json());// to support JSON-encoded bodies.
app.use(function(req, res, next) {// Allow cors
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/info', function(req, res, next) {
  //var url = req.query.url;
  var url = 'http://stackoverflow.com/questions/14936841/extract-all-images-from-an-external-site-node-js';
  /*if (!url) {
    return res.status(400).json({ message: 'Field url is required'});
  }*/

  var r = request(url, function(error, response, html) {
    var images = html.match(/<img[^>]>([^>]+)/gi);
    //var title = html.match(/<title>(.*?)<\/title>/i)[1];
    //res.send(html);
    //res.json(title);
  })
  .on('response', function(response) {
    console.log(response.statusCode); // 200
    console.log(response.headers['content-type']); // 'image/png'
    console.log(response.headers['content-length']);
    console.log(response.headers['content-encoding']);
    res.json();
  })
  .on('error', function(err) {
    console.log(err)
  })
  .on('data', function(data) {
    // decompressed data as it is received
    console.log('decoded chunk: ' + typeof data);
    var title = data.toString('utf8').match(/<title>(.*?)<\/title>/i);
    if (title) {
      res.json(title[1]);
      r.abort();
    }
  });

});

/**
 * Start Express server.
 */
var server = app.listen(3006, function() {
  console.log('Post server listening on port %d in %s mode.', 3006, app.get('env'));
});
