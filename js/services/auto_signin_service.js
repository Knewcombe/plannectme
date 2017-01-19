angular.module("app").service('AutoSignInService', ['$localStorage', '$sessionStorage', '$q', '$http', '$rootScope', 'UserControlService', function ($localStorage, $sessionStorage, $q, $http, $rootScope, UserControlService) {

	this.autoSignIn = function (email, password){
		var deferred = $q.defer();
		var user = {email, password};
		var promise = UserControlService.authUser(user);
		promise.then(function(data){
			deferred.resolve(data);
		})
		return deferred.promise;
	}

}]);
