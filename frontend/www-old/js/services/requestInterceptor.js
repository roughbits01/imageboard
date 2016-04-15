module.factory('sessionInjector', ['SessionService', function($q, $location, SessionService) {
    var sessionInjector = {
        request: function(config) {
          // automatically attach Authorization header
            if(SessionService.isAuthentificated()) {
              config.headers['Authorization'] = 'Bearer ' + SessionService.getToken();
            }
            return config;
        },
        // This is the responseError interceptor
    responseError: function(rejection) {
      if (rejection.status === 401) {
        $location.path("/login");
      }

      /* If not a 401, do nothing with this error.
       * This is necessary to make a `responseError`
       * interceptor a no-op.
       */
      return $q.reject(rejection);
    },
    response: function(res) {
  if(res.config.url.indexOf(API) === 0 && res.data.token) {
    auth.saveToken(res.data.token);
  }

  return res;
}
    };
    return sessionInjector;
}]);
module.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('sessionInjector');
}]);
