/**
 * Module dependencies.
 */
var logger = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var express = require('express');
var request = require("request");
var url = require('url');
var entities = require("entities");


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

  var link = req.query.link;
  if (!link) {
    return res.status(400).json({ message: 'Field link is required'});
  }

  var head = true;
  var hostname = url.parse(link).hostname;
  var title = null;
  //var description = null;
  var image = null;
  //var type = null;

  var r = request(link, function(error, response, html) {
    //var images = html.match(/<img[^>]>([^>]+)/gi);
    //var title = html.match(/<title>(.*?)<\/title>/i)[1];
    //res.send(html);
    //res.json(title);
  })
  .on('response', function(response) {
    //console.log(response.statusCode); // 200
    //console.log(response.headers['content-type']); // 'image/png'
    console.log(response.headers['content-length']);
    //console.log(response.headers['content-encoding']);
    //res.json();
  })
  .on('error', function(err) {
    console.log(err)
  })
  .on('data', function(chunk) {
    // Decompressed data as it is received.
    var data = chunk.toString('utf8');
    console.log('decoded chunk: ' + data.length);
    // If we are still parsing <head></head> and we didn't yet find a title.
    if (head) {
      // Allow th author to specify the image and title using the Open Graph protocol.
      if (!title) title = data.match(/<meta[\s]*property="(twitter|og):title"[\s]*content="(.*?)"[\s]*\/?[\s]*>/);
      //if (!description) description = data.match(/<meta[\s]*property="og:description"[\s]*content="(.*?)"[\s]*\/?[\s]*>/);
      if (!image) image = data.match(/<meta[\s]*property="(twitter|og):image"[\s]*content="(.*?)"[\s]*\/?[\s]*>/);
      //if (!type) type = data.match(/<meta[\s]*property="og:type"[\s]*content="(.*?)"[\s]*\/?[\s]*>/);
      // We found what we need so it's unnecessary to continue donloading the page.
      if (title && image) {
        r.abort();
        return res.json({
          hostname: hostname,
          title: entities.decodeHTML(title[2]),
          //description: description[1],
          image: image[2],
          //type: type[1]
        });
      }
    } else {
      return res.json({
        hostname: hostname,
        title: title,
        //description: description,
        image: image,
        //type: type
      });
    }
    head = !/<body/.test(data);
    console.log(head);
  });
});

/**
 * Start Express server.
 */
var server = app.listen(3006, function() {
  console.log('Post server listening on port %d in %s mode.', 3006, app.get('env'));
});
