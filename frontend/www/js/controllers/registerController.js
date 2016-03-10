function registerCtrl($location, SessionService) {

var credentials = {
  name : "",
  email : "",
  password : ""
};

$scope.submit = function () {
  SessionService
    .register(vm.credentials)
    .error(function(err){
      alert(err);
    })
    .then(function(){
      $location.path('profile');
    });
};
