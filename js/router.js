angular.module("app").config(function($routeProvider, $locationProvider){

	$locationProvider.html5Mode(false);

	$routeProvider.when('/',{
		templateUrl: 'views/home.html',
		controller: 'HomeController',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user != null){
                //Do something
								$location.path('/dashboard');    //redirect user to home.
						}
        }
			}
	});

	$routeProvider.when('/signup',{
		templateUrl: 'views/sign_up.html',
		controller: 'CreateProfile',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user != null){
                //Do something
								$location.path('/profile');    //redirect user to home.
                //alert("You have access here");
						}
        }
			}
	});

	$routeProvider.when('/signup/information',{
		templateUrl: 'views/sign_up-information.html',
		controller: 'CreateProfile',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user != null){
                //Do something
								$location.path('/profile');    //redirect user to home.
                //alert("You have access here");
						}
        }
			}
	});

	$routeProvider.when('/signup/images',{
		templateUrl: 'views/sign_up-images.html',
		controller: 'CreateProfile',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user != null){
                //Do something
								$location.path('/profile');    //redirect user to home.
                //alert("You have access here");
						}
        }
			}
	});

	$routeProvider.when('/signup/preferences',{
		templateUrl: 'views/sign_up-preferences.html',
		controller: 'CreateProfile',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user != null){
                //Do something
								$location.path('/profile');    //redirect user to home.
                //alert("You have access here");
						}
        }
			}
	});

	$routeProvider.when('/test',{
		templateUrl: 'views/testUpload.html',
		controller: 'TestUpload'
	});

	$routeProvider.when('/signin', {
		templateUrl: 'views/sign_in.html',
		controller: 'SignIn',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user != null){
                //Do something
								$location.path('/dashboard');    //redirect user to home.
						}
        }
			}
	});

	$routeProvider.when('/profile', {
		templateUrl: 'views/profile.html',
		controller: 'Profile',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user == null){
                //Do something
								$location.path('/signin');    //redirect user to home.
						}
        }
			}
	});

	$routeProvider.when('/status', {
		templateUrl: 'views/status.html',
		controller: 'StatusController',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user == null){
                //Do something
								$location.path('/signin');    //redirect user to home.
						}
        }
			}
	});

	$routeProvider.when('/dashboard', {
		templateUrl: 'views/dashboard.html',
		controller: 'DashboardController',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user == null){
                //Do something
								$location.path('/signin');    //redirect user to home.
						}
        }
			}
	});

	$routeProvider.when('/favorite', {
		templateUrl: 'views/favorite.html',
		controller: 'Favorite',
		resolve:{
        "check":function($location, $localStorage, $sessionStorage){
            if($sessionStorage.user == null){
                //Do something
								$location.path('/signin');    //redirect user to home.
						}
        }
			}
	});

	$routeProvider.when('/forgot_password',{
		templateUrl: 'views/forgotpassword.html',
		controller: 'ForgotPassword',
	});

	$routeProvider.when('/answer',{
		templateUrl: 'views/answerQuestions.html',
		controller: 'answerQuestions',
	});

	$routeProvider.when('/new_password',{
		templateUrl: 'views/newPassword.html',
		controller: 'newPassword',
	});

	$routeProvider.when('/not_found', {
        templateUrl: 'views/error.html'
    });

	$routeProvider.otherwise({
		redirectTo: '/not_found'
	});

});
