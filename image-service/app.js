/**
 * Module dependencies.
 */
var path = require('path');
var fs = require('fs');
var crypto = require('crypto')
var logger = require('morgan');
var multer  = require('multer');
var sharp = require('sharp');
var bodyParser = require('body-parser');
var ColorThief = require('color-thief');
var request = require('request');
var async = require('async');
var express = require('express');

var colorThief = new ColorThief();

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

app.use(bodyParser.urlencoded({ extended: true }));// to support URL-encoded bodies.
app.use(bodyParser.json());// to support JSON-encoded bodies.

app.get('/photos', function(req, res, next) {
  fs.readdir('uploads/original', (err, data) => {
    if (err) throw err;
    var images = data.map(function(e) {
      var ext = path.extname(e);
      return 'uploads/thumbnail/' + path.basename(e, ext) + '.jpg';
    });
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

var maxSize = 4 * 1024 * 1024;

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
    files: 1,
    fileSize: maxSize
  }
});

app.post('/photos/upload', uploader.single('photo'), function (req, res, next) {
  sharp('uploads/original/' + req.file.filename)
  .resize(300, 200)
  .toFile('uploads/thumbnail/' + req.file.filename, function(err) {
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
    console.log(colorThief.getPalette('uploads/thumbnail/' + req.file.filename, 8));
    // Build a color palette from an image
  });
  res.redirect('/uploads/original/' + req.file.filename);
});

request.defaults({'proxy':'http://55.1.35.226:8080'});

app.post('/photos/uploadurl', function (req, res, next) {
  var url = req.body.url;
  if (!url) {
    return res.status(400).json({ message: 'Field url is required'});
  }

  request.head(url, function(err, response, body) {
    if (err) return res.status(500).json({ message: 'Invalid URL' });

    var status = response.statusCode;
    if (status != 200 && status != 304) {
      return res.status(400).json({ message: 'Could not access the URL' });
    }

    var type = response.headers['content-type'];
    if(allowedMime.indexOf(type) == -1) {
      return res.status(400).json({ message: 'Only JPEG and PNG images are accepted' });
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

      var thumbnail = 'uploads/thumbnail/' + id + '.jpg';
      // Create thumbnail
      sharp(filename)
      .resize(300, 200)
      .toFile(thumbnail, function(err) {
        // output.jpg is a 300 pixels wide and 200 pixels high image
        // containing a scaled and cropped version of input.jpg
      });
    });
  });
});

app.use("/", express.static(__dirname + "/"));
app.use('/', express.static('views'));

/**
 * Start Express server.
 */
var server = app.listen(3003, function() {
  console.log('Image server listening on port %d in %s mode.', 3003, app.get('env'));
});
