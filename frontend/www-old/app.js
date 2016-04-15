angular.module('myApp', [])

  .directive('rating', function() {
    return {
      scope: {
        rate: '='
      },
      templateUrl: 'templates/rating.html',
      link: function(scope, element, attrs) {
        scope.range = [1,2,3,4,5];

        scope.update = function(value) {
          scope.rate = value;
        };
      }
    };
  })

  .controller('MainCtrl', function($scope) {
    $scope.rate = 2;
  });
