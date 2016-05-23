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

  isEmpty = function(str) {
    return (!str || 0 === str.length);
  }

  isInteger = function(val) {
    return typeof val === 'number' && !Number.isNaN(val) && val % 1 === 0;
  };

  inRange = function(val, min, max) {
    return val >= min && val <= max;
  };

  contains = function(val, list) {
    return list.indexOf(val) !== -1;
  }

  /**
   * Helper function for iterating over an array. If the func returns
   * a true value, it will break out of the loop.
   */
  each = function(arr, func) {
    if (arr) {
      var i;
      for (i = 0; i < ary.length; i += 1) {
        if (arr[i] && func(arr[i], i, arr)) {
          break;
        }
      }
    }
  }

  /**
   * Helper function for iterating over an array. If the func returns
   * a true value, it will break out of the loop.
   */
  each = function(arr, func) {
    if (arr) {
      var i;
      for (i = 0; i < arr.length; i += 1) {
        if (arr[i] && func(arr[i], i, arr)) {
          break;
        }
      }
    }
  }
}
