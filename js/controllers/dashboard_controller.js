angular.module("app").controller('DashboardController', function($scope, $location, $rootScope, $localStorage, CountryFactory, $sessionStorage, ProfileServices){
	//This will display all of the users of the app to rate.
	console.log("Dashbaord");
	$rootScope.url = $location.path();
	$scope.profileData = "";
	$scope.profileIndex = 0;
	$scope.countryEmoji = "";
	$scope.profileAverage = 0;
	$scope.profileFav = false;
	// $scope.profileRating = 60;
	$scope.images = [];
	$scope.direction = 'left';
	$scope._Index = 0;
	$scope.profiePromise = []

	var getInfo = function(){
		$scope.images = []; // clear array
		//Find country data
		$.each($scope.countryData, function(key, value){
			if($scope.profileData[$scope.profileIndex].country == value.alpha2 || $scope.profileData[$scope.profileIndex].country == value.alpha3){
				$scope.countryEmoji = value.emoji;
				$scope.countryName = value.name;
			}
		});
		//Get profile images.
		$scope.profiePromise[1] = ProfileServices.getProfilePics($scope.profileData[$scope.profileIndex].profile_id, $sessionStorage.user.token).then(function(data){
			$.each(data, function(index, value){
				$scope.images[index] = 'data:image/JPEG;base64,'+ value.image;
			});
		})
		$scope.profiePromise[2] = ProfileServices.getAverage($sessionStorage.user.token, $scope.profileData[$scope.profileIndex].profile_id).then(function(data){
			$scope.profileAverage = data.replace("'", "").replace("'", "");
		});
		$scope.profiePromise[3] = ProfileServices.findFavourite($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.profileIndex].profile_id).then(function(data){
			$scope.profileFav = data;
		})

		ProfileServices.getRating($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.profileIndex].profile_id).then(function(data){
			if(data != 0){
				$scope.slider.value = data[0].rate_amount;
			}else{
				$scope.slider.value = 60;
			}
		})
	}
	//Getting country data to display.
	CountryFactory.then(function(data){
		$scope.countryData = data;
	});
	//Getting a list of profiles.
	//Later will need to check for profile types, this will see what profiles can be viewed at what time.
	$scope.getProfiles = function(){
		$scope.profiePromise[0] = ProfileServices.getProfiles($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData).then(function(data){
			if(data.length != 0){
				if($scope.profileData.length > 0){
					$scope.profileData += data;
					++$scope.profileIndex;
				}else{
					$scope.profileData = data;
				}
				getInfo();
			}else{
				console.log("No new profiles have been added, this will give the user a message or change the directive.");
			}
		});
	}


	$scope.nextProfile = function(){
		if(($scope.profileIndex + 1) > ($scope.profileData.length - 1)){
			$scope.getProfiles();
		}else{
			++$scope.profileIndex;
			getInfo();
		}
	}
	$scope.previousProfile = function(){
		if(($scope.profileIndex - 1) < 0){
			console.log($scope.profileIndex);
		}else{
			--$scope.profileIndex;
			getInfo();
		}
	}

	//Function for rating the profile
	$scope.slider = {
		value: 60,
		options: {
			floor: 60,
			ceil: 100,
			step: 1,
			hideLimitLabels: true,
			precision: 0,
			showSelectionBar: true,
			getSelectionBarColor: function(value) {
					if (value <= 70)
							return 'red';
					if (value <= 80)
							return 'orange';
					if (value <= 90)
							return 'yellow';
					return '#2AE02A';
				},
				onEnd: function() {
					//Will call the rating function here.
					console.log($scope.slider.value);
					ProfileServices.rateProfile($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.profileIndex].profile_id, $scope.slider.value).then(function(){
						console.log("Complete");
					})
				}
		}
	};


	//Function for favourting the profile.
	$scope.favouriteProfile = function(){
		ProfileServices.favouriteProfile($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.profileIndex].profile_id).then(function(){
			console.log("Complete");
			$scope.profileFav = true;
			console.log($scope.profileFav);
		})
	}

	$scope.removeFavourite = function(){
		console.log("Remove Profile");
		ProfileServices.removeFavourite($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.profileIndex].profile_id).then(function(){
			console.log("Complete");
			$scope.profileFav = false;
		})
	}

	$scope.openLightboxModal = function(index){
    Lightbox.openModal($scope.images, index);
  };
})

		angular.module("app").controller('ProfileViewController', function($scope, $location, $rootScope, $localStorage, CountryFactory, $sessionStorage, ProfileServices){

			$scope.isActive = function (index) {
				return $scope._Index === index;
			};

				// show prev image
			$scope.showPrev = function () {
				$scope.direction = 'right';
				$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.images.length - 1;
			};
			// show next image
			$scope.showNext = function () {
				$scope.direction = 'left';
				$scope._Index = ($scope._Index < $scope.images.length - 1) ? ++$scope._Index : 0;
			};
			// show a certain image
			$scope.setCurrentSlideIndex = function (index) {
				$scope.direction = (index > $scope._Index) ? 'left' : 'right';
				$scope.$scope._Index = index;
			};

			$scope.isCurrentSlideIndex = function (index) {
				return $scope._Index === index;
			};

			$scope.showPhoto = function(index){
				$scope.direction = (index > $scope._Index) ? 'left' : 'right';
				$scope._Index = index;
			}
			$scope.isActive = function (index) {
				return $scope._Index === index;
			};
		}).animation('.slide-animation', function () {
		        return {
		            beforeAddClass: function (element, className, done) {
		                var scope = element.scope();

		                if (className == 'ng-hide') {
		                    var finishPoint = element.parent().width()*2;
		                    if(scope.direction !== 'right') {
		                        finishPoint = -finishPoint;
		                    }
		                    TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
		                }
		                else {
		                    done();
		                }
		            },
		            removeClass: function (element, className, done) {
		                var scope = element.scope();

		                if (className == 'ng-hide') {
		                    element.removeClass('ng-hide');
		                    var startPoint = element.parent().width()*2;
		                    if(scope.direction === 'right') {
		                        startPoint = -startPoint;
		                    }

		                    TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
		                }
		                else {
		                    done();
		                }
		            }
		        };
		    });
