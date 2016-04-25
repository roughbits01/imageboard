angular.module('myApp').controller('ThreadsController', function ($scope, $http, LocalService) {
  $scope.random = function() {
    return Math.floor((Math.random()*500)+1);
  }

  $scope.list = true;

  $scope.showList = function(flag) {
    $scope.list = flag;
    console.log(flag);
  };

  $scope.images = [];
  $scope.pinned = [];
  var pins = LocalService.getObject('pinned');
  if (pins) $scope.pinned = pins;

  $http.get('/photos').then(function(response) {
    $scope.images = response.data
    console.log($scope.images);
  });

  $scope.pin = function(index) {
    for (var i = 0; i < $scope.pinned.length; i++) {
      if ($scope.images[index] === $scope.pinned[i]) {
        return;
      }
    }
    $scope.pinned.push($scope.images[index]);
    LocalService.setObject('pinned', $scope.pinned);
  }

  $scope.unpin = function(index) {
    $scope.pinned.splice(index, 1);
    LocalService.setObject('pinned', $scope.pinned);
  }
});
