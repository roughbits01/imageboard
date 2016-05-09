var Board = require('../models/board');
var Thread = require('../models/thread');
var Post = require('../models/post');
var express = require('express');
var router = express.Router();
var helpers = require('../helpers');

//GET /threads
//GET /threads/:id
//GET /threads/:id/replies
//POST /threads/:id/replies
//DELETE /threads/:id
//PUT /threads/:id
//POST /threads/:id/close
//POST /threads/:id/upvote
//POST /threads/:id/downvote
//POST /threads/:id/unvote
//GET /threads/:id/votes
//POST /threads/:id/report
//GET /threads/reported
//GET /threads/random
//GET /threads/latests
//GET /threads/hottest
//GET /threads/:id/tags

/**
 * GET /threads
 * List all active threads.
 */
router.route('/')
.get(function(req, res) {
  var offset = parseInt(req.query.offset);
  if (isNaN(offset)) offset = 0;
  var limit = parseInt(req.query.limit);
  if (isNaN(limit)) limit = 25;
  // As we are not showing the comments we may exclude them while fetching.
  Thread.find({}).select('-replies').skip(offset).limit(limit).exec(function(err, threads) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Threads could not be retrieved from database. Please try again in a few moments.' });
    }
    res.json(threads);
  });
});

/**
 * GET /threads/hottest  db.collection.find().limit(1).sort({$natural:-1})
 * List all active threads.
 */
router.route('/')
.get(function(req, res) {
  /**
   * As we are not showing the comments we may exclude them while fetching.
   */
  Thread.find().select('-replies').limit(25).sort({'votes.count':-1}).exec(function(err, threads) {
    if (err) {
      return res.status(500).json({ message : 'Threads could not be retrieved from database. Please try again in a few moments.' });
    }
    res.json(threads);
  });
});

/**
 * GET /threads/latests
 * List all active threads.
 */
router.route('/')
.get(function(req, res) {
  /**
   * As we are not showing the comments we may exclude them while fetching.
   */
  Thread.find().select('-replies').limit(25).sort({$natural:-1}).exec(function(err, threads) {
    if (err) {
      return res.status(500).json({ message : 'Threads could not be retrieved from database. Please try again in a few moments.' });
    }
    res.json(threads);
  });
});

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

/**
 * GET /threads/:id
 * Get a thread by id.
 */
router.route('/:id')
.get(function(req, res) {
  Thread.findById(req.params.id/*, { $inc: { views: 1 }}*/, function(err, thread) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (!thread) return res.status(404).json({ message: 'Thread not found! It may has been pruned or deleted' });
    res.json(thread);

    if (req.user) { // If we have a user.
      // Use mqtt to notify about the user.
      // 1- Store the visited thread for later processing.
      // 2- Use Redis for last accessed threads.
    }
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

router.route('/:id/replies')
.get(function(req, res) {
  // Locate the thread by its id.
  var id = req.params.id;

  Thread.find({
    _id: id,
    replies: { $elemMatch: { 'votes.count': { $gt: 10 } } }
  }, 'replies', function(err, thread) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Posts could not be retrieved from database.' });
    }
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    res.json(thread.toTree());
  });
})
.post(function(req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var text = req.body.text;
  var parent = req.body.parent;
  console.log(req.body);

  if (!helpers.isDefined(name) || !helpers.isDefined(text) || !helpers.isDefined(parent)) {
    return res.status(422).json({ message : 'error' });
  }

  var conditions = {
    _id: id,
    locked: false,
    replyCount: { $gt: parent }
  };

  var updates = {
    $push: { replies: { name: name, text: text, parent: parent }},
    $inc: { replyCount: 1 }
  };

  Thread.update(conditions, updates, function(err, count) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Post could not be saved into database.' });
    }
    console.log(count);
    // The field count is the number of updated documents.
    if (!count) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    res.status(204).json();
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
router.route('/:threadid/replies/:postid/upvote')
.post(function(req, res) {
  var threadid = req.params.threadid;
  var postid = req.params.postid;
  var ip = req.connection.remoteAddress;
  // This query succeeds only if the voters array doesn't contain the user.
  var selector = {};
  var operators = {};
  selector['replies.' + postid + '.votes.positive'] = ip;
  operators['$addToSet'] = selector;
  Thread.update({_id: threadid}, operators, function(err, update) {
    console.log(update);
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (!update.ok) return res.status(404).json({ message: 'Thread not found' });
    if (!update.nModified) return res.status(401).json({ message: 'Already upvoted' });
    res.status(204).json();
  });
});

// Threads can be voted to the front page.
router.route('/:id/upvote')
.post(function(req, res) {
  var id = req.params.id;
  var ip = req.connection.remoteAddress;
  // This query succeeds only if the voters array doesn't contain the user.
  var query = {
    _id: id,
    locked: false,
    'votes.positive': {
      '$ne': ip
    }
  };

  /*
https://github.com/mongodb/cookbook/blob/master/content/patterns/votes.txt
  If you want to allow users to retract their votes, the code is quite simiar:
  // This query succeeds when the voter has already voted on the story.
query   = {_id: ObjectId("4bcc9e697e020f2d44471d27"), voters: user_id};

// Update to remove the user from the array and decrement the number of votes.
update  = {'$pull': {'voters': user_id}, '$inc': {vote_count: -1}}
*/

  // Update to add the user to the array and increment the number of votes.
  var updates = {'$push': {'votes.positive': ip}, '$inc': {'votes.count': 1}}
  Thread.update(query, updates, function(err, updated) {
    console.log(updated);
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (!updated.ok) return res.status(404).json({ message: 'Thread not found' });
    if (!updated.nModified) return res.status(401).json({ message: 'Already upvoted' });
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
