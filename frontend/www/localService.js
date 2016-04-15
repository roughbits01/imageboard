angular.module('myApp')
.factory('LocalService', function () {
  var service = {};
  service.get = get;
  service.getObject = getObject;
  service.set = set;
  service.setObject = setObject;
  service.unset = unset;
  service.clear = clear;
  return service;

  function get(key) {
    return localStorage.getItem(key);
  }

  function getObject(key) {
    var value = localStorage.getItem(key);
    return value && JSON.parse(value);
  }

  function set(key, val) {
    return localStorage.setItem(key, val);
  }

  function setObject(key, val) {
    return localStorage.setItem(key, JSON.stringify(val));
  }

  function unset(key) {
    return localStorage.removeItem(key);
  }

  function clear() {
    localStorage.clear();
  }
});
