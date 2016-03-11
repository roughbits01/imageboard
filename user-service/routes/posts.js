var Thread = require('../models/thread');
var Post = require('../models/post');
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
//GET /posts/reported

router.route('/:id')
.get(function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    if (err) return res.status(500).json({ message : 'Internal Server Error' });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  });
})
.put(function(req, res) {
  var updates = {};
  if (req.body.text) updates.text = req.body.text;
  if (req.body.image) updates.image = req.body.image;

  Post.findByIdAndUpdate(req.params.id, updates, { new : true }, function(err, post) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Internal Server Error' });
    }
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  });
})
.delete(function(req, res) {
  Post.findByIdAndRemove(req.params.id, function(err, post) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message : 'Internal Server Error' });
    }
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(204).json();
  });
});



module.exports = router;
