var mongoose = require('mongoose');

var threadSchema = new mongoose.Schema({
  title: { type: String, maxLength: 50, trim: true, required: true },
  text: { type: String, maxLength: 1000, trim: true, required: true },
  replies: [{
    text: { type: String, maxLength: 200, trim: true, required: true },
    parent: Number,
    posted: { type: Date, default: Date.now }
  }],
  board: { type : String },
  views: Number,// The total number of views.
  /*votes: {
    ups: Number,// Number of upvotes.
    downs: Number//	Number of downvotes.
  },*/
    //positive: [{ type: ObjectId, ref: voterModelName }],
    //negative: [{ type: ObjectId, ref: voterModelName }],
    //count: Number
  created: { type: Date, default: Date.now },
  //locked: Boolean,
  //nsfw: Boolean,// Indicates if the thread has been marked as nsfw or not.
  //__v: { type: Number, select: false} // Hide version property.
});

threadSchema.virtual('replies.count')
.get(function() {
	return this.replies.length;
});

/**
 * Helper method for validating user's password.
 */
threadSchema.methods.toTree = function() {
  var nodes = this.replies, node, roots = [];
  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
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
