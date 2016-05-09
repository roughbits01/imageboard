angular.module('myApp').factory('Thread', function($http) {
  return {
    getThread: function(id) {
      return $http.get('http://localhost:3000/threads/' + id);
    },
    postReply: function(id, reply) {
      return $http.post('http://localhost:3000/threads/' + id, reply);
    }
  };
});
