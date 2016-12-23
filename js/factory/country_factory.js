angular.module("app").factory('CountryFactory', ['$localStorage', '$sessionStorage', '$q', '$http', 'API_CONN', '$rootScope', function ($localStorage, $sessionStorage, $q, $http, API_CONN, $rootScope) {
			var deferred = $q.defer();
			console.log("Getting country information");
			$http.get(API_CONN.NODE_SERVER+'/extra/contry_data')
				.success(function(data) {
						deferred.resolve(data);
		    })
		    .error(function(data) {
		        console.log('Error: ' + data);
		    });
				return deferred.promise;
}]);
