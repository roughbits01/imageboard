var mongoose = require('mongoose');

var threadSchema = new mongoose.Schema({
  title: { type : String, maxLength: 50, trim: true, required: true },
  //account_id: // The account ID or null if it's anonymous.
  replies: Number,
  views: Number,// The total number of views.
  votes: {
    ups: Number,// Number of upvotes.
    downs: Number//	Number of downvotes.
  },
    //positive: [{ type: ObjectId, ref: voterModelName }],
    //negative: [{ type: ObjectId, ref: voterModelName }],
    //count: Number
  created: { type: Date, default: Date.now },
  board: { type : String },
  locked: Boolean,
  nsfw: Boolean,// Indicates if the thread has been marked as nsfw or not.
  __v: { type: Number, select: false} // Hide version property.
});

module.exports = mongoose.model('Thread', threadSchema);
