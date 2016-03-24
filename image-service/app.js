/**
 * Module dependencies.
 */
var path = require('path');
var crypto = require('crypto')
var logger = require('morgan');
var multer  = require('multer');
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
    destination: './uploads/',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err);
        cb(null, raw.toString('hex') + file.ext);
      });
    }
  }),
  limits: {
    files: 1,
    fileSize: 4194304
  }
});

app.post('/photos/upload', uploader.single('photo'), function (req, res, next) {
  res.redirect('/photos/' + req.file.filename);
});

app.use('/views', express.static('views'));
app.use('/photos', express.static('uploads'));

/**
 * Start Express server.
 */
var server = app.listen(3003, function() {
  console.log('Image server listening on port %d in %s mode.', 3003, app.get('env'));
});
