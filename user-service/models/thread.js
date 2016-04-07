var mongoose = require('mongoose');

var threadSchema = new mongoose.Schema({
  title: { type: String, maxLength: 50, trim: true, required: true },
  text: { type: String, maxLength: 1000, trim: true },
  name: { type: String, maxLength: 20, trim: true },
  replies: [{
    name: { type: String, maxLength: 20, trim: true },
    text: { type: String, maxLength: 200, trim: true, required: true },
    parent: Number,
    votes: {
      positive: [{ type: String }],// Number of upvotes.
      negative: [{ type: String }],//	Number of downvotes.
      count: Number
    },
    posted: { type: Date, default: Date.now }
  }],
  count: Number,
  board: { type : String },
  views: Number,// The total number of views.
  created: { type: Date, default: Date.now },
  locked: Boolean,
  nsfw: Boolean,// Indicates if the thread has been marked as nsfw or not.
  __v: { type: Number, select: false} // Hide version property.
});

threadSchema.post('findById', function(doc) {
  console.log("Post Find Id");
});

threadSchema.virtual('replies.count')
.get(function() {
	return this.replies.length;
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
