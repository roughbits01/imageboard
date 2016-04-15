angular.module('myApp', [])
.controller('todoController', ['$scope','$http','Todo', function($scope, Todo) {

  $scope.formData = {};
  $scope.loading = true;

  // When landing on the page, get all todos.
  $scope.todos = Todo.query(function() {
    $scope.loading = false;
  });

  /**
   * Create a Todo item.
   * @param {string} text The content of the TODO
   */
  $scope.createTodo = function() {

    if ($scope.formData.text) {
      $scope.loading = true;

      // Call the create function from our service (returns a promise object)
      var todo = Todo.post({text: $scope.formData.text}, function() {
        $scope.loading = false;
        $scope.formData = {}; // clear the form so our user is ready to enter another
        $scope.todos = data; // assign our new list of todos
      });
    }
  };

  // Delete a todo after checking it.
  $scope.deleteTodo = function(id) {
    $scope.loading = true;

    Todo.delete(id)
    // if successful creation, call our get function to get all the new todos
    .success(function(data) {
      $scope.loading = false;
      $scope.todos = data; // assign our new list of todos
    });
  };
}]);
