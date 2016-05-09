angular.module('myApp').controller('ThreadsController', function ($scope, $http, LocalService) {

  $scope.list = true;

  $scope.showList = function(flag) {
    $scope.list = flag;
    console.log(flag);
  };

  $scope.images = [];
  $scope.latests = [];
  $scope.pinned = LocalService.getObject('pinned');

  /**
   * Shuffles array in place.
   * @param {Array} a items The array containing the items.
   */
   function shuffle (array) {
     var i = 0, j = 0, tmp = 0;

     for (i = array.length - 1; i > 0; i -= 1) {
       j = Math.floor(Math.random() * (i + 1));
       tmp = array[i];
       array[i] = array[j];
       array[j] = tmp;
     }
   }

  $http.get('/photos').then(function(response) {
    $scope.images = response.data;
    $scope.images = $scope.images.map(function(e) {
      var obj = {};
      obj.image = e;
      obj.votes = Math.floor((Math.random()*500)+1);
      obj.comments = Math.floor((Math.random()*200)+1);
      return obj;
    });
    console.log($scope.images);

    shuffle($scope.images);
    $scope.images = $scope.images.slice(0, 25);
    $scope.latests = $scope.images.slice(0, 5);
    $scope.latests = $scope.latests.map(e => e.image.replace('big','small'));
    shuffle($scope.images);
  });

  $scope.pin = function(post) {
    var exists = $scope.pinned.find(e => e === post);
    if (!exists) {
      $scope.pinned.push(post);
    }
    LocalService.setObject('pinned', $scope.pinned);
  }

  $scope.unpin = function(index) {
    $scope.pinned.splice(index, 1);
    LocalService.setObject('pinned', $scope.pinned);
  }
});
