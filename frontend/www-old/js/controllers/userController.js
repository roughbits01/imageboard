angular.module('monApp')
  .controller('UsersCtrl', function ($scope, User) {
    $scope.users = User.query();
    $scope.update(user) {
      user.$update();
    }
    $scope.delete(user) {
      user.$delete();
    }
    $scope.create(newUserName) {
      var user = new User();
      user.name = newUserName;
      user.$save();
      $scope.users.push(user);
    }
  });
