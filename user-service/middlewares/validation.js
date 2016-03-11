var jwt = require('jsonwebtoken');

// Route middleware to verify a JWT token.
// Access to endpoints is restricted by roles.
module.exports = function(requiredRoles) {
  return function(req, res, next) {

    // Check Authorization header for JWT token.
    var token = req.headers.authorization;

    // If there is no token, return an error.
    if (!token) return res.status(403).send({ message: 'Please make sure your request has an Authorization header' });

    // Verifies secret and checks exp.
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        if (err.name == 'TokenExpiredError')
        return res.status(403).json({ message: 'Token has expired.' });
        return res.status(403).json({ message: 'Failed to authenticate token.' });
      }

      var userRoles = decoded.roles;

      if (!roleCheck(requiredRoles, userRoles))
      return res.status(403).json({ message: 'Insufficient rights.' });
      // If everything is good, save to request for use in other routes.
      req.user = decoded.sub;
      next();
    });
  }
}

/**
 * Checks if a user has sufficient rights.
 */
function roleCheck(userRoles, requiredRoles) {
  return intersects(userRoles, requiredRoles);
}


/**
 * Finds the the first intersection of two arrays.
 *  a - first array, must already be sorted.
 *  b - second array, must already be sorted.
 */
function intersects(a, b) {
  var i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] < b[j]) i++;
    else if (a[i] > b[j]) j++;
    else return true;/* they're equal */
  }
  return false;
}
