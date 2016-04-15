angular.module('myApp')
.factory('SessionService', function ($http, LocalService) {
  var service = {};
  service.login = login;
  service.logout = logout;
  service.isAuthentificated = isAuthentificated;
  service.token = LocalService.get('token');
  return service;

  function login(username, password) {
    $http.post("/api/login/", { username : username, password : password })
    .success(function(data, status) {
      $location.path('/');
    })
    .error(function (data, status, headers, config) {
      // uh oh
    });
  }

  function logout() {
    // The backend doesn't care about logouts, delete the token and you're good to go.
    LocalService.clear();
  }

  function isAuthentificated() {
    if (service.token) {
      var params = parseJWT(service.token);
      return Math.round(new Date().getTime() / 1000) <= params.exp;
    }
    return false;
  }

  function saveToken(toke) {
    service.token = token;
    LocalService.set('token', token);
  }

  function parseJWT(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }
});
