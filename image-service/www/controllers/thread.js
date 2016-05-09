angular.module('myApp').controller('ThreadController', function ($scope, $http) {
  $http.get('http://localhost:3000/threads/57290681fd94ed0c19c3e54d/replies').then(function(response) {
    $scope.posts = response.data;
  });
});
