var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true
  },
  fullname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  verified: Boolean,
  /**
   * A moderator has the power to remove posts and comments from a subreddit,
   * mark posts and comments as spam, ban a user from posting, and invite
   * other users to become moderators. The user that creates the subreddit
   * is automatically assigned as the top moderator and can override
   * any action taken by any other moderators.
   */
  role: {
    type: String,
    enum: ['user', 'gold', 'mod', 'admin', 'founder'],
    select: false
  },
  reputation: Number,
  picture: String,
  created: { type: Date, default: Date.now, select: false },
  updated: { type: Date, select: false },
  lastAccess: { type: Date, default: Date.now },
  // A cache of the last time the user voted on a comment.
  // Used to remove any comments from those 100 that are younger than the last vote
  // (since they can't possibly have voted on them).
  // Then look up the keys containing the remaining ones.
  votes: {
    positive: [ String ],// List of upvoters.
    negative: [ String ],//	List of downvoters.
    count: { Number, default: 0 }// An integer caching the number of votes.
  },
  lastVoted: { type: Date, default: Date.now },
  __v: { type: Number, select: false} // Hide version property.
});

/**
 * Password hash middleware.
 */
 userSchema.pre('save', function(next) {
   var user = this;
   // Only hash the password if it has been modified (or is new).
   if (!user.isModified('password')) return next();
   // Generate a salt.
   bcrypt.genSalt(10, function(err, salt) {
     if (err) return next(err);
     // Hash the password along with our new salt.
     bcrypt.hash(user.password, salt, function(err, hash) {
       if (err) return next(err);
       // Override the cleartext password with the hashed one.
       user.password = hash;
       next();
     });
   });
 });

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidate, callback) {
  bcrypt.compare(candidate, this.password, function(err, matches) {
    if (err) return callback(err);
    callback(null, matches);
  });
};

/**
 * Generate JSON Web Token.
 */
userSchema.methods.generateToken = function() {
  var expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 60);

  return jwt.sign({
    sub: this._id,
    name: this.name,
    roles: this.roles,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET); // secret is defined in the environment variable JWT_SECRET
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', userSchema);
