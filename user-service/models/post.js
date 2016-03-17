var mongoose = require('mongoose');
var crypto = require('crypto');

var postSchema = new mongoose.Schema({
	text: { type : String, maxLength: 200, trim: true, required: true },
	code: { type : String, maxLength: 32},
  image: String,
  voteCount: { type : Number },
	votes: [{ user : mongoose.Schema.ObjectId , type: Number }],
  created: { type: Date, default: Date.now },
  thread: mongoose.Schema.ObjectId,
	__v: { type: Number, select: false} // Hide version property.
});

/**
 * Code hash middleware.
 */
 postSchema.pre('save', function(next) {
   var post = this;
   // Only hash the password if it has been modified (or is new).
   if (!post.isModified('code')) return next();

	 var hash = crypto.createHash('md5').update(user.password, 'utf8').digest('hex');
	 // Override the cleartext password with the hashed one.
	 user.password = hash;
	 next();
 });

module.exports = mongoose.model('Post', postSchema);
