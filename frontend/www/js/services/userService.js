angular.module('myApp', ['ngResource'])
.factory('User', ['$resource',
  function($resource) {
    return $resource('/api/users/:userId', {userId:'@id'},
    {
      'update': {method: 'PUT'},
      'enable': {method: 'PUT', {userId: '@id', params; {'enabled': true}}}
    });
  }
]);
