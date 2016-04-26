/**
 * Module dependencies.
 */
var util = require('util');
var path = require('path');
var fs = require('fs');// in order to write to the filesystem we need the `fs` lib
var crypto = require('crypto')
var logger = require('morgan');
var multer  = require('multer');
//var color = require('color');
var sharp = require('sharp');
var bodyParser = require('body-parser');
var compression = require('compression');
//var attention = require('attention');
var request = require('request');
var async = require('async');
var express = require('express');

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

app.get('/photos', function(req, res, next) {
  fs.readdir('uploads/thumbnail/small', (err, data) => {
    if (err) throw err;
    var images = data.map(e => '/uploads/thumbnail/big/' + e);
    res.json(images);
  });
});

/**
 * Prepare upload folder.
 */
var allowedMime = [ 'image/jpeg', 'image/png', 'image/gif', 'image/jpg' ];

var exts = {
  'image/jpeg': '.jpg',
  'image/jpg' : '.jpg',
  'image/png' : '.png',
  'image/gif' : '.gif'
};

var maxSize = 40 * 1024 * 1024;

var uploader = multer({
  fileFilter: function(req, file, cb) {
    if(allowedMime.indexOf(file.mimetype) == -1) {
      // To reject this file pass `false`, like so:
      cb(null, false);
      return;
    }
    file.ext = exts[file.mimetype];
    cb(null, true);
  },
  storage: multer.diskStorage({
    destination: './uploads/original',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err);
        cb(null, raw.toString('hex') + file.ext);
      });
    }
  }),
  limits: {
    //files: 1,
    fileSize: maxSize
  }
});

app.post('/photos/upload', uploader.array('photo'), function (req, res, next) {
  var files = req.files;
  files.forEach(function(file) {
    console.log(file.filename + ': started');
    sharp('uploads/original/' + file.filename)
    //.metadata(function(err, metadata) { console.log(metadata) })
    //.withoutEnlargement()
    .jpeg()
    .resize(300, 200)
    .toFile('uploads/thumbnail/big/' + file.filename, function(err) {
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
      console.log(file.filename + ': big finished');
      /*attention('uploads/thumbnail/' + req.file.filename)
      .swatches(8)
      .palette(function(err, palette) {
        console.log('It took me ' + palette.duration + 'ms to find the palette');
        palette.swatches.forEach(function(swatch) {
          console.log(swatch);
        });
      });*/
    })
    .resize(256, 256)
    .toFile('uploads/thumbnail/square/' + file.filename, function(err) {
      console.log(file.filename + ': square finished');
    })
    .resize(120, 80)
    .toFile('uploads/thumbnail/small/' + file.filename, function(err) {
      console.log(file.filename + ': small finished');
    });
  });

  res.json();
  //res.redirect('uploads/original/' + req.file.filename);
});

request.defaults({'proxy':'http://www-cache.ujf-grenoble.fr:3128'});

app.post('/photos/uploadurl', function (req, res, next) {
  var url = req.body.url;
  if (!url) {
    return res.status(400).json({ message: 'Field url is required'});
  }

  request.head(url, function(err, response, body) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Invalid URL' });
    }

    var status = response.statusCode;
    if (status != 200 && status != 304) {
      return res.status(400).json({ message: 'Could not access the URL' });
    }

    var type = response.headers['content-type'];
    if(allowedMime.indexOf(type) == -1) {
      return res.status(400).json({ message: 'Only JPEG, PNG, and GIF images are accepted' });
    }

    var size = response.headers['content-length'];
    if(size > maxSize) {
      return res.status(400).json({ message: 'The requested image is too big' });
    }

    var ext = exts[type];
    var id = crypto.pseudoRandomBytes(16).toString('hex');
    var filename = 'uploads/original/' + id + ext;

    request(url).pipe(fs.createWriteStream(filename)).on('close', function() {
      res.redirect('/' + filename);

      // Create thumbnail
      sharp(filename)
      //.metadata(function(err, metadata) { console.log(metadata) })
      .jpeg()
      .resize(300, 200)
      .toFile('uploads/thumbnail/big/' + id + '.jpg', function(err) {})
      .resize(256, 256)
      .toFile('uploads/thumbnail/square/' + id + '.jpg', function(err) {})
      .resize(120, 80)
      .toFile('uploads/thumbnail/small/' + id + '.jpg', function(err) {});
    });
  });
});


app.use("/", express.static(__dirname + "/"));
app.use('/', express.static('www'));

/**
 * Start Express server.
 */
var server = app.listen(3003, function() {
  console.log('Image server listening on port %d in %s mode.', 3003, app.get('env'));
});
