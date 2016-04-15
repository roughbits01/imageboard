angular.module('myApp').controller('ThreadController', function ($scope, $http) {
  $http.get('http://localhost:3000/threads/57025265cd9371742911b76d/posts').then(function(response) {
    $scope.posts = response.data;
  });
});
