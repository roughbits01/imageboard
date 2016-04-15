angular.module('myApp')
.directive('colors', function() {
  return {
    restrict: 'E',
    scope: {
      data: '=data'
    },
    template: '<div class="w3-row"><div ng-repeat="color in data" class="w3-col s1 w3-padding-8" style="background-color: {{color}}"></div></div>'
  };
});
