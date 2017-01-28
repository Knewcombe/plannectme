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

angular.module("app").controller('ForgotPassword', function($scope, $location, $rootScope, $localStorage, $sessionStorage, UserControlService){
	$scope.email = "";
	$scope.emailError = "";
	$scope.emailAlert = false;

	$scope.getQuestions = function(){
		console.log("Getting Questions");
		UserControlService.getQuestions($scope.email).then(data){
			if(data != 'false'){
				$scope.emailError = "";
				$scope.emailAlert = false;
				$sessionStorage.questions = data;
				$location.path('/answer');
			}else{
				$scope.emailError = "No account using this email was found, please try again.";
				$scope.emailAlert = true;
			}
		}
	}
});

angular.module("app").controller('answerQuestions', function($scope, $location, $rootScope, $localStorage, $sessionStorage, UserControlService){

	$scope.questions = [];
	$scope.answerError = "";
	$scope.answerAlert = false;

	$.each($sessionStorage.questions, function(index, value){
		$scope.questions.push({
			'id': value.question_id,
			'question': value.question,
			'answer': ''
		})
	});

	$scope.submitAnswers = function(){
		console.log("Sending Data");
		UserControlService.sendAnswers($scope.questions).then(data){
			if(data != 'false'){
				console.log("All answers match");
				$scope.answerError = "";
				$scope.answerAlert = false;
				$sessionStorage.user_idd = data;
				$location.path('/new_password');
			}else{
				//error
				$scope.answerError = "One or more of the answer were wrong, please review and try again.";
				$scope.answerAlert = true;
			}
		}
	}

});

angular.module("app").controller('newPassword', function($scope, $location, $rootScope, $localStorage, $sessionStorage, UserControlService){
	$scope.newPassword = "";
	$scope.confirmPassword = "";

	$scope.passwordError = "";
	$scope.passwordAlert = false;

	$scope.submitNewPassword = function(){
		if($scope.newPassword == $scope.confirmPassword){
			$scope.passwordError = "";
			$scope.passwordAlert = false;
			UserControlService.saveNewPassword().then(data){
				if(data != 'false'){
					console.log("Password has changed");
					$location.path('/sign_in');
				}
			}
		}else{
			$scope.passwordError = "Password dose not match, please try again.";
			$scope.passwordAlert = true;
		}
	}
});
