angular.module('myApp', ['ngResource'])
.factory('Todo', ['$resource',
  function($resource) {
    return $resource('/api/todos/:id', {id:'@id'},
    {
      'update': {method: 'PUT'}
    });
  }
]);
