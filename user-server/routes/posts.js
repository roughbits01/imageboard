var User = require('../models/post');
var express = require('express');
var router = express.Router();

//GET /posts
//GET /posts/:id
//DELETE /posts/:id
//PUT /posts/:id
//POST /posts/:id/upvote
//POST /posts/:id/downvote
//POST /posts/:id/report
//POST /posts/:id/hide

router.route('/')
.get(function(req, res) {
  if (req.query.sort) {

  }
  if (req.query.fields) {

  }
  if (req.query.q) {

  }
  if (req.query.q) {

  }
  User.find().sort('-created').limit(50).exec(function(err, users) {
    if (err) {
      return res.status(500).json({ message : 'Users could not be retrieved from database. Please try again.' });
    }
    res.json(users);
  });
});


module.exports = router;
