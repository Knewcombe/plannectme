/**
 * @license Plannectme v0.0.1
 * (c) 2016-2017 Plannectme, Inc.
 * License: Plannectme
 * Description: DashboardController is used to insure all informaiton is gathered from the server to be shown to the user. This will also allow the user
 * to customize the search options for other users.
 */
angular.module("app").controller('DashboardController', function($scope, $location, $rootScope, $localStorage, CountryFactory, $sessionStorage, ProfileServices){
	//This will display all of the users of the app to rate.
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

	$scope.searchOptions = {
		'country': '',
		'gender': '',
		'age':{
			'min': 18,
			'max': 25
		}
	}
	//Jquery for the age slider in the custom search options.
	$(function() {
  	$("#age-slider").slider({
			range:true,
			min: 18,
			max: 100,
			values: [ $scope.searchOptions.age.min, $scope.searchOptions.age.max ],
			slide: function( event, ui ) {
				$( "#amount" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
				$scope.searchOptions.age.min = ui.values[0];
				$scope.searchOptions.age.max = ui.values[1];
			}
		});
		//Jqury will updated the numbers above the age slider with the right values.
		$( "#amount" ).val($( "#age-slider" ).slider( "values", 0 ) +" - " + $( "#age-slider" ).slider( "values", 1 ) );
	});
	//Will ask the server to new list of memebers of the site that meet the new search options. If it is successfull it will overwrite the list of users.
	$scope.submitSearch = function(){
		if($scope.searchOptions.country == null){
			$scope.searchOptions.country = "";
		};
		$scope.profiePromise[0] = ProfileServices.getProfiles($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $sessionStorage.user.profile.country, 0, $scope.searchOptions).then(function(data){
			if(data.length != 0){
				$scope.profileData = data;
				getInfo();
			}else{
				console.log("No new profiles have been added, this will give the user a message or change the directive.");
			}
		});
	}
	//GetInfo is to gather all of the extra information needed for the focused profile. This includes location, profile pictures, rating average, and if the memeber is a favourite
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

		ProfileServices.getAverage($sessionStorage.user.token, $scope.profileData[$scope.profileIndex].profile_id).then(function(data){
			$scope.profileAverage = data.replace("'", "").replace("'", "");
		});
		ProfileServices.findFavourite($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.profileIndex].profile_id).then(function(data){
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
		ProfileServices.getProfiles($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $sessionStorage.user.profile.country, $scope.profileData, $scope.searchOptions).then(function(data){
			if(data.length != 0){
				if($scope.profileData.length > 0){
					$scope.profileData += data;
					++$scope.profileIndex;
				}else{
					$scope.profileData = data;
				}
				getInfo();
			}else{
				// console.log("No new profiles have been added, this will give the user a message or change the directive.");
				//Will need to add something here to make it more appling.
			}
		});
	}
	//Will proceed to the next index
	$scope.nextProfile = function(){
		$scope.direction = 'left';
		$scope.profileIndex = ($scope.profileIndex < $scope.profileData.length - 1) ? ++$scope.profileIndex : 0;
		getInfo();
	}
	//Will go back to previous index
	$scope.previousProfile = function(){
		$scope.direction = 'right';
		$scope.profileIndex = ($scope.profileIndex > 0) ? --$scope.profileIndex : $scope.profileData.length - 1;
		getInfo();
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
					ProfileServices.rateProfile($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.profileIndex].profile_id, $scope.slider.value).then(function(){
						// console.log("Complete");
						//Will need to add something here as well to make it more appleing
					})
				}
		}
	};
	//Function for favourting the profile.
	$scope.favouriteProfile = function(){
		ProfileServices.favouriteProfile($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.profileIndex].profile_id).then(function(){
			$scope.profileFav = true;
		})
	}
	//Remove profile form favourts
	$scope.removeFavourite = function(){
		ProfileServices.removeFavourite($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.profileIndex].profile_id).then(function(){
			$scope.profileFav = false;
		})
	}
	//Full screen profile view.
	$scope.openLightboxModal = function(index){
    Lightbox.openModal($scope.images, index);
  };
})

/**
 * @license Plannectme v0.0.1
 * (c) 2016-2017 Plannectme, Inc.
 * License: Plannectme
 * Description: Profile view controller will have all the functionality that is used in the Profile Div.
 */

angular.module("app").controller('ProfileViewController', function($scope, $location, $rootScope, $localStorage, CountryFactory, $sessionStorage, ProfileServices){
			// What is the current active image.
			$scope.isActive = function (index) {
				return $scope._Index === index;
			};

			// show prev image
			$scope.showPrev = function () {
				$scope.direction = 'down';
				$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.images.length - 1;
			};
			// show next image
			$scope.showNext = function () {
				$scope.direction = 'up';
				$scope._Index = ($scope._Index < $scope.images.length - 1) ? ++$scope._Index : 0;
			};
			// show a certain image
			$scope.setCurrentSlideIndex = function (index) {
				$scope.direction = (index > $scope._Index) ? 'up' : 'down';
				$scope.$scope._Index = index;
			};

			$scope.isCurrentSlideIndex = function (index) {
				return $scope._Index === index;
			};

			$scope.showPhoto = function(index){
				$scope.direction = (index > $scope._Index) ? 'up' : 'down';
				$scope._Index = index;
			}
	}).animation('.slide-animation', function () {
		        return {
		            beforeAddClass: function (element, className, done) {
		                var scope = element.scope();

		                if (className == 'ng-hide') {
		                    var finishPoint = element.parent().width()*2;
		                    if(scope.direction !== 'down') {
		                        finishPoint = -finishPoint;
		                    }
		                    TweenMax.to(element, 0.5, {top: finishPoint, onComplete: done });
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
		                    if(scope.direction === 'down') {
		                        startPoint = -startPoint;
		                    }

		                    TweenMax.fromTo(element, 0.5, {top: startPoint }, {top: 0, onComplete: done });
		                }
		                else {
		                    done();
		                }
		            }
		        };
		    });
