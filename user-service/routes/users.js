var User = require('../models/user');
var express = require('express');
var router = express.Router();

router.route('/')
// Lists all users, in the order that they signed up on GitHub.
.get(function(req, res) {
  var start = new Date;
  User.find().sort('-created').limit(50).exec(function(err, users) {
    if (err) {
      return res.status(500).json({ message : 'Users could not be retrieved from database. Please try again.' });
    }
    var ms = new Date() - start;
    res.header('X-Response-Time', ms + 'ms');
    res.header("Cache-Control", "public, max-age=60");
    res.json(users);
  });
})
// Create a new user when a POST request is made to /api/users.
.post(function(req, res) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).json(errors);
  }

  User.count({ email: req.body.email }, function(err, count) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (count > 0) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    // Init user and add missing fields.
    var user = new User({
      email: req.body.email,
      password: req.body.password,
      roles: ['user']
    });

    user.save(function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message : 'Internal Server Error' });
      }
      // In case of a POST that resulted in a creation, use a HTTP 201 status code
      // and include a Location header that points to the URL of the new resource.
      res.location('/users/id/' + result._id)
      res.status(201).json({ token: user.generateToken() });
    });
  });
});

// This will handle the url calls for /users/:id
router.route('/id/:id')
.get(function(req, res) {
  if (!req.user || req.user.id != req.params.id) return res.sendStatus(401);
  User.findById(req.params.id, '-_id -__v', function(err, user) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (!user) return res.status(400).json({
      message: 'No account with that username has been found'
    });
    res.json(user);
  });
})
.put(function(req, res) {
  var doc = {};
  if (req.body.name) doc.name = req.body.name;
  if (req.body.email) doc.email = req.body.email;
  if (req.body.roles) doc.roles = req.body.roles.split(',').sort();
  doc.updated = Date.now();
  User.findByIdAndUpdate(req.params.id, doc, function(err, user) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Internal Server Error' });
    }
    res.json(user);
  });
})
.delete(function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Internal Server Error' });
    }
    //res.status(204).json();
    res.status(200).json({ message: 'User successfully deleted!' });
  });
});

/**
 * Get the authenticated user.
 */
router.route('/me')
.get(function(req, res) {
  User.findById(req.user, function(err, user) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    res.header("Cache-Control", "public, max-age=60");
    res.json(user);
  });
})

/**
 * Find 5 most recent user accounts.
 */
router.route('/moderators')
.get(function(req, res) {
  User.find({roles : 'mod'}, function(err, user) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    res.json(user);
  });
})


/**
 * Forgot for reset password.
 */
router.route('/me/forgot')
.post(function(req, res) {
  User.findById(req.user, function(err, user) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    res.header("Cache-Control", "public, max-age=60");
    res.json(user);
  });
})

router.route('/search/')
// Return all users when we get a GET request to /api/users.
.get(function(req, res) {
  var query = {};
  if (req.query.name) query.name = req.query.name;
  var filter = {};
  if (req.query.skip) filter.skip = req.query.skip;
  if (req.query.limit) filter.limit = req.query.limit;
  // Return all users selecting only the `name` fields.
  User.find(query, '-_id -__v', filter, function(err, data) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    //res.header("Cache-Control", "public, max-age=60");
    res.json(data);
  });
})

/**
 * Find 5 most recent user accounts.
 */
router.route('/last/')
.get(function(req, res) {
  // Return all users selecting only the `name` fields.
  User.find().sort({ _id: -1 }).limit(5).exec(function(err, users) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    res.header("Cache-Control", "public, max-age=60");
    res.json(users);
  });
})

router.route('/exists/:username')
.get(function(req, res) {
  User.count({ name: req.params.username }, function (err, count) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    res.json(count > 0);
  });
});

router.route('/exists/email/:email')
.get(function(req, res) {
  req.assert('email', 'Email is not valid').isEmail();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).json(errors);
  }
  User.count({ email: req.params.email }, function (err, count) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    res.json(count > 0);
  });
});

router.route('/:id/resetpassword')
.post(function(req, res) {
  if (!req.user || req.user.id != req.params.id) return res.sendStatus(401);
  //
});



module.exports = router;
