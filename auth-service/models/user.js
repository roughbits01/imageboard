var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  roles: [ String ]
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

module.exports = mongoose.model('User', userSchema);
