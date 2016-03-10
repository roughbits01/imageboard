var Board = require('../models/board');
var Thread = require('../models/thread');
var Post = require('../models/post');
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
      return res.status(500).json({ message : 'Threads could not be retrieved from database.' });
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
});

router.route('/:id')
.get(function(req, res) {
  Thread.findById(req.params.id, function(err, thread) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.json(thread);
  });
})
.put(function(req, res) {
  var updates = {};
  if (req.body.title) updates.title = req.body.title;

  Thread.findByIdAndUpdate(req.params.id, updates, function(err, thread) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Internal Server Error' });
    }
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.json(thread);
  });
})
.delete(function(req, res) {
  Thread.findByIdAndRemove(req.params.id, function(err, thread) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Internal Server Error' });
    }
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.status(204).json();
  });
});

router.route('/:id/posts')
.get(function(req, res) {
  // First locates the thread by its id, then locate all related posts.
  Thread.findById(req.params.id, function(err, thread) {
    if (err) {
      return res.status(500).json({ message : 'Posts could not be retrieved from database.' });
    }
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    Post.find({ thread: thread.id}, function(err, posts) {
      if (err) {
        return res.status(500).json({ message : 'Posts could not be retrieved from database.' });
      }
      res.json(posts);
    });
  });
})
.post(function(req, res) {
  Thread.findById(req.params.id, function(err, thread) {
    if (err) {
      return res.status(500).json({ message : 'Post could not be saved into database.' });
    }
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    var post = new Post({
      text: req.body.text,
      image: req.params.image,
      thread: thread.id
    });
    post.save(function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message : 'Internal Server Error' });
      }
      res.location('/posts/' + result.id);
      res.status(201).json(result);
    });
  });
});

module.exports = router;
