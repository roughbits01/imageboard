angular.module('myApp')
.factory('LocalService', function () {
  var service = {};
  service.get = get;
  service.set = set;
  service.unset = unset;
  service.clear = clear;
  return service;

  function get(key) {
    return localStorage.getItem(key);
  }

  function set(key, val) {
    return localStorage.setItem(key, val);
  }

  function unset(key) {
    return localStorage.removeItem(key);
  }

  function clear() {
    localStorage.clear();
  }
});
