var User = require('../models/post');
var express = require('express');
var router = express.Router();

//GET /threads
//GET /threads/:id
//GET /threads/:id/posts
//POST /threads/:id/posts
//DELETE /threads/:id
//PUT /threads/:id
//GET /threads/top
//POST /threads/:id/upvote
//POST /threads/:id/downvote
//POST /threads/:id/report

router.route('/')
.get(function(req, res) {
  Thread.find().exec(function(err, threads) {
    if (err) {
      return res.status(500).json({ message : 'Threads could not be retrieved from database. Please try again.' });
    }
    res.json(threads);
  });
})
.post(function(req, res) {
  Board.count({ name: req.body.name }, function(err, count) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (count > 0) {
      return res.status(409).send({ message: 'Board with that name already exists' });
    }
    var board = new Board({
      name: req.body.name,
      description: req.body.description,
    });

    board.save(function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message : 'There was a problem adding the information to the database.' });
      }
      res.location('/boards/' + result.name);
      res.status(201).json(result);
    });
  });
})

module.exports = router;
