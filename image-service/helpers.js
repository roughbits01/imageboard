/*
  Validation helpers
*/
module.exports = {
  isDefined = function(val) {
    return typeof val !== 'undefined' && val !== null;
  };

  isObject = function(val) {
    return typeof val === 'object';
  };

  isBuffer = function(val) {
    return typeof val === 'object' && val instanceof Buffer;
  };

  isString = function(val) {
    return typeof val === 'string' && val.length > 0;
  };

  isInteger = function(val) {
    return typeof val === 'number' && !Number.isNaN(val) && val % 1 === 0;
  };

  inRange = function(val, min, max) {
    return val >= min && val <= max;
  };
  
  contains = function(val, list) {
    return list.indexOf(val) !== -1;
  }
}
