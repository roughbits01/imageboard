var mongoose = require('mongoose');

var threadSchema = new mongoose.Schema({
  title: { type: String, maxLength: 50, trim: true, required: true },
  text: { type: String, maxLength: 1000, trim: true },
  name: { type: String, maxLength: 20, trim: true },
  replyCount: { type: Number, default: 0 },
  replies: [{
    name: { type: String, maxLength: 20, trim: true },
    text: { type: String, maxLength: 200, trim: true, required: true },
    parent: Number,
    // We want your users to be able to vote on submitted stories..
    // Store the vote information in the object itself.
    // * Make sure that each user gets just one vote.
    // * Keep a counter cache on the number of votes.
    votes: {
      positive: [ String ],// List of upvoters.
      negative: [ String ],//	List of downvoters.
      count: { Number, default: 0 }// An integer caching the number of votes.
    },
    posted: { type: Date, default: Date.now }
  }],
  votes: {
    positive: [ String ],// List of upvoters.
    negative: [ String ],//	List of downvoters.
    count: { Number, default: 0 }// An integer caching the number of votes.
  },
  board: { type : String },
  views: Number,// The total number of views.
  created: { type: Date, default: Date.now },
  locked: { type: Boolean, default: false },
  nsfw: Boolean,// Indicates if the thread has been marked as nsfw or not.
  __v: { type: Number, select: false} // Hide version property.
});

/**
 * Helper method for validating user's password.
 */
threadSchema.methods.toTree = function() {
  var nodes = this.replies.map(function(e) {
    return e._doc;
  });
  var node, roots = [];
  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
    node.id = i;
    node.replies = [];
    if (node.parent !== undefined && node.parent >= 0 && node.parent < i) {
      nodes[node.parent].replies.push(node);
      delete node.parent;
    } else {
      roots.push(node);
    }
  }
  return roots;
}

module.exports = mongoose.model('Thread', threadSchema);
