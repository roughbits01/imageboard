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

app.use(bodyParser.urlencoded({ extended: true }));// to support URL-encoded bodies.
app.use(bodyParser.json());// to support JSON-encoded bodies.

app.get('/photos', function(req, res, next) {
  fs.readdir('uploads/original', (err, data) => {
    if (err) throw err;
    var images = data.map(function(e) {
      return 'uploads/thumbnail/' + e;
    });
    res.json(images);
  });
});

/**
 * Prepare upload folder.
 */
 var allowedMime = [ "image/jpeg", "image/png" ];

 var exts = {
   "image/jpeg": '.jpg',
   "image/png" : '.png'
 };

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
    //fileSize: 4194304
  }
});

app.post('/photos/upload', uploader.single('photo'), function (req, res, next) {
  sharp('uploads/original/' + req.file.filename)
  .resize(300, 200)
  .toFile('uploads/thumbnail/' + req.file.filename, function(err) {
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });
  res.redirect('/uploads/original/' + req.file.filename);
});

var download = function(url, filename, callback){
  request({
    url: url,
    proxy: 'http://www-cache.ujf-grenoble.fr:3128'
  }).pipe(fs.createWriteStream(filename)).on('close', callback);
};

app.use("/", express.static(__dirname + "/"));
app.use('/', express.static('views'));

/**
 * Start Express server.
 */
var server = app.listen(3003, function() {
  console.log('Image server listening on port %d in %s mode.', 3003, app.get('env'));
});
