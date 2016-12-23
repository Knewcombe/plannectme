angular.module("app").controller('HomeController', function($scope, $location, $rootScope, $localStorage, $sessionStorage){

	$scope.sesssionStorage = $sessionStorage;

	$rootScope.url = $location.path();

	$scope.signup = function(){
		$location.path('/signup');
	}

})

angular.module("app").controller('HeaderController', function($scope, $location, $rootScope, $localStorage, $sessionStorage){

	$scope.sesssionStorage = $sessionStorage;


	$scope.signIn = function(){
		$location.path('/signin');
	}

	$scope.profile = function(){
		$location.path('/profile');
	}

	$scope.dashboard = function(){
		$location.path('/dashboard');
	}

	$scope.favorite = function(){
		$location.path('/favorite');
	}

	$scope.status = function(){
		$location.path('/status');
	}

	$scope.logout = function(){
		$sessionStorage.user = null;
		$location.path('/signin');
	}

});
