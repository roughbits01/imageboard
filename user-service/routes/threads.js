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
//GET /threads/top Popular Threads
//POST /threads/:id/close
//POST /threads/:id/upvote
//POST /threads/:id/downvote
//POST /threads/:id/unvote
//GET /threads/:id/votes
//POST /threads/:id/report Report a link, comment or message.
//GET /threads/reported
//GET /threads/random
//GET /threads/:id/tags

/**
 * GET /threads
 * List all active threads.
 */
router.route('/')
.get(function(req, res) {
  Thread.find({}, '-replies').limit(100).exec(function(err, threads) {
    if (err) {
      return res.status(500).json({ message : 'Threads could not be retrieved from database. Please try again in a few moments.' });
    }
    res.json(threads);
  });
})

/**
 * GET /random
 * List n random threads.
 */
router.route('/random')
.get(function(req, res) {
  Thread.count().exec(function(err, count) {
    if (err) {
      return res.status(500).json({ message : 'Threads could not be retrieved from database.' });
    }
    var random = Math.floor(Math.random() * count);
    Thread.findOne().skip(random).exec(function(err, thread) {
      if (err) {
        return res.status(500).json({ message : 'Threads could not be retrieved from database.' });
      }
      res.json(thread);
    });
  });
});

router.route('/:id')
.get(function(req, res) {
  Thread.findById(req.params.id/*, { $inc: { views: 1 }}*/, function(err, thread) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (!thread) return res.status(404).json({ message: 'Thread not found! It may has been pruned or deleted' });
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
  /*Thread.findById(req.params.id, function(err, thread) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Posts could not be retrieved from database.' });
    }
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    Post.find({ thread: thread.id }, function(err, posts) {
      if (err) {
        return res.status(500).json({ message : 'Posts could not be retrieved from database.' });
      }
      res.json(posts);
    });
  });*/
  Thread.findById(req.params.id, 'replies', function(err, thread) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Posts could not be retrieved from database.' });
    }
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.json(thread.toTree());
  });
})
.post(function(req, res) {
  Thread.findByIdAndUpdate(req.params.id, {
    $push: { replies: { name: req.body.name, text: req.body.text, parent: req.body.parent }},
    $inc: { count: 1}
  },
  function(err, thread) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Post could not be saved into database.' });
    }
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    res.status(201).json(thread);
  });

  /*Thread.findById(req.params.id, function(err, thread) {
    if (err) {
      return res.status(500).json({ message : 'Post could not be saved into database.' });
    }
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    if (thread.locked) {
      return res.status(503).json({ message: 'Posting on this thread is currently disabled.' });
    }
    var post = new Post({
      name: req.body.name,
      text: req.body.text,
      image: req.body.image,
      thread: req.params.id
    });
    post.save(function(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message : 'Internal Server Error' });
      }
      res.location('/posts/' + result.id);
      res.status(201).json(result);
    });*/
});

// Threads can be voted to the front page.
router.route('/:id/posts/:postid/upvote')
.post(function(req, res) {
  var threadid = req.params.id;
  var postid = req.params.postid;
  var ip = req.connection.remoteAddress;
  var selector1 = {}, selector2 = {};
  var operators = {};
  selector1['replies.' + postid + '.votes.positive'] = ip;
  selector2['replies.' + postid + '.votes.count'] = 1;
  operators['$addToSet'] = selector1;
  operators['$inc'] = selector2;
  Thread.update(threadid, operators, function(err, update) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (!update.ok) return res.status(404).json({ message: 'Thread not found' });
    //if (update.nModified)
    res.status(204).json();
  });
});

router.route('/:id/votes')
.get(function(req, res) {
  // First locates the thread by its id.
  Thread.findById(req.params.id, 'votes', function(err, thread) {
    if (err) {
      return res.status(500).json({ message : 'Votes could not be retrieved from database.' });
    }
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.json(thread);
  });
});

module.exports = router;
