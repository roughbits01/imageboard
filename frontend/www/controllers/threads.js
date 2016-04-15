angular.module('myApp').controller('ThreadsController', function ($scope, $http, LocalService) {
  $scope.random = function() {
    return 12;// Math.floor((Math.random()*500)+1);
  }

  $scope.colors = [
    '#404948', '#948c86', '#616650', '#c5bebd',
    '#4f564c', '#78775e', '#dad4d2', '#ada6a6'
  ];

  $scope.list = false;

  $scope.showList = function(flag) {
    $scope.list = flag;
    console.log(flag);
  };

  $scope.images = [];
  $scope.pinned = [];
  var pins = LocalService.getObject('pinned');
  if (pins) $scope.pinned = pins;

  $http.get('http://localhost:3003/photos').then(function(response) {
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
