angular.module("app").controller('CreateProfile', function($scope, $location, $rootScope, $localStorage, $sessionStorage, UserControlService, AutoSignInService, ProfileServices){

	$scope.test = [];
	$scope.contry_data = [];
	$scope.profiePromise = [];
	$scope.error;
	$scope.alert = false;
	$scope.step = 0;
	$scope.formComplete = false;

	$rootScope.url = $location.path();


	$scope.images = [];

	$scope.profileFormData = {
		'firstName': '',
		'lastName': '',
		'password': '',
		'confirm_password': '',
		'gender':'',
		'country': '',
		'dob': '',
		'email':'',
		'options':{
			'rating': 1,
			'visiableRate': 1,
			'hidden': 1
		}
	}

	$scope.dateChange = function(){
	  var today = new Date();
	  var birthDate = new Date($scope.profileFormData.dob);
	  var age = today.getFullYear() - birthDate.getFullYear();
	  var m = today.getMonth() - birthDate.getMonth();
	  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){
			age--;
		}
		if(age){
			console.log(age);
		}
	}

	$scope.nextStep = function(){
		console.log("test");
		if($scope.step == 0){
			console.log("0");
			if($scope.profileFormData.password === $scope.profileFormData.confirm_password){
				console.log("Match");
				if($scope.alert){
					$scope.alert = false;
				}
				++$scope.step;
			}else{
				$scope.error = "Passwords do not match, please try again.";
				$scope.alert = true;
			}
		}else{
			++$scope.step;
		}
	}

	$scope.prevStep = function(){
		--$scope.step;
	}

	for(var i = 0; 5 > i; i++){
		$scope.images[i] = "";
	}

	$scope.submit = function(){
			$scope.profiePromise[0] = UserControlService.setUser($scope.profileFormData).then(function(){
				//Auto sign in..
				$scope.profiePromise[1] = AutoSignInService.autoSignIn($scope.profileFormData.email, $scope.profileFormData.password).then(function(data){
					if(data.token){
						$sessionStorage.user = data;
						var imageUpload = [];
						$.each($scope.images, function(key, value){
							if(value != ""){
								imageUpload.push(value);
							}
						});
					}else{
						$scope.error = "Email is already in use. Please choose another.";
						$scope.alert = true;
						$scope.step = 0;
					}
					if(imageUpload.length > 0){
						$scope.profiePromise[2] = ProfileServices.uploadProfilePics($sessionStorage.user.userInfo.profile_id, $sessionStorage.user.token, imageUpload).then(function(){
							$location.path('/dashboard');
						}, null, function(percent){
							$scope.progress = percent;
						});
					}else{
						$location.path('/dashboard');
					}
				})
			})
	}
})

angular.module("app").controller('SignIn', function($scope, $location, $rootScope, $localStorage, $sessionStorage, UserControlService){
	$scope.error;
	$scope.alert = false;

	$scope.userFormData = {
		'email': '',
		'password': ''
	}

	$scope.signup = function(){
		$location.path('/signup');
	}

	$scope.submit = function(){
		UserControlService.authUser($scope.userFormData).then(function(data){
			if(data.token){
				$sessionStorage.user = data;
				$location.path('/dashboard');
			}else{
				$scope.error = "Email or password do not match, please try again.";
				$scope.alert = true;
			}
		})
	}

});

angular.module("app").controller('Profile', function($scope, $location, $rootScope, $localStorage, $sessionStorage, UserControlService, ProfileServices){
	//This will allow the user to make any changes to their profile.
	$scope.profiePromise = [];

	$scope.passwordError;
	$scope.passwordAlert = false;

	$scope.profileError;
	$scope.profileAlert = false;

	$scope.optionsError;
	$scope.optionsAlert = false;

	var d = new Date($sessionStorage.user.userInfo.date_of_birth);
	$rootScope.url = $location.path();
	$scope.date = d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate();

	$scope.images = [];

	for(var i = 0; 5 > i; i++){
		$scope.images[i] = {
			'pictureId': 0,
			'image': '',
			'changed': false
		};
	}

	$scope.profileFormData = {
		'firstName': $sessionStorage.user.userInfo.first_name,
		'lastName': $sessionStorage.user.userInfo.last_name,
		'gender': $sessionStorage.user.profile.gender,
		'country': $sessionStorage.user.profile.country,
		'dob': $scope.date,
		'email': $sessionStorage.user.userInfo.user_email,
		'options':{
			'rating': $sessionStorage.user.profile.allow_rating,
			'visiableRate': $sessionStorage.user.profile.visable_rating,
			'hidden': $sessionStorage.user.profile.hidden
		}
	}


	console.log($scope.profileFormData.dob);

	$scope.passwordChange = {
		'confirmPassword': '',
		'newPassword' : '',
		'oldPassword' : ''
	}

	$scope.profiePromise[0] = ProfileServices.getProfilePics($sessionStorage.user.userInfo.profile_id, $sessionStorage.user.token).then(function(data){
		$.each(data, function(index, value){
			$scope.images[index].pictureId = value.pictureId;
			$scope.images[index].image = 'data:image/JPEG;base64,'+ value.image;
		});
	})

	//This is just to see the images and stuff.
	$scope.submitPictures = function(){
		$.each($scope.images, function(index, value){
			if(value.image.name){
				//This is where I will update the photos that are needed.
				$scope.profiePromise[1] = ProfileServices.updatePhotos($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, value.image, value.pictureId).then(function(data){
					console.log("Complete");
				});
			}
		});
	}

	$scope.submitPassword = function(){
		// if(password is not filled in)
		if($scope.passwordChange.confirmPassword === $scope.passwordChange.newPassword){
				$scope.profiePromise[2] = UserControlService.changePassword($sessionStorage.user.userInfo.user_id, $scope.passwordChange.oldPassword, $scope.passwordChange.newPassword, $sessionStorage.user.token).then(function(data){
					if(data.auth){
						$scope.passwordError = data.auth;
						$scope.passwordAlert = true;
					}else{
						$scope.passwordChange.confirmPassword = "";
						$scope.passwordChange.newPassword = "";
						$scope.passwordChange.oldPassword = "";
						if($scope.passwordAlert){
							$scope.passwordError = "";
							$scope.passwordAlert = false;
						}
					}
				});
			}else{
				$scope.passwordError = "Please confirm the New Password";
				$scope.passwordAlert = true;
			}
		}


	$scope.submitProfile = function(){
		//Will make sure everything is correct and submit.
		if($scope.profileFormData.firstName != $sessionStorage.user.userInfo.first_name || $scope.profileFormData.lastName != $sessionStorage.user.userInfo.last_name ||
			$scope.profileFormData.gender != $sessionStorage.user.profile.gender || $scope.profileFormData.country != $sessionStorage.user.profile.country ||
			$scope.profileFormData.dob != $scope.date || $scope.profileFormData.email != $sessionStorage.user.userInfo.user_email){

				$scope.profileFormData.userId = $sessionStorage.user.userInfo.user_id;
				$scope.profileFormData.profileId = $sessionStorage.user.userInfo.profile_id;
				$scope.profiePromise[3] = UserControlService.updateUser($scope.profileFormData, $sessionStorage.user.token).then(function(data){
					if(data.userInfo && data.profile){
						$sessionStorage.user.profile = data.profile;
						$sessionStorage.user.userInfo = data.userInfo;
						if($scope.profileAlert){
							$scope.profileError = "";
							$scope.profileAlert = false;
						}
					}else{
						$scope.profileError = data;
						$scope.profileAlert = true;
					}
				});
			}else{
				console.log("No changes were made");
				$scope.profileError = "No changes have been made to User Information.";
				$scope.profileAlert = true;
			}
	}

	$scope.submitOptions = function(){
		console.log($scope.profileFormData)
		console.log($sessionStorage.user)
		if($scope.profileFormData.options.rating != $sessionStorage.user.profile.allow_rating || $scope.profileFormData.options.visiableRate != $sessionStorage.user.profile.visable_rating ||
		$scope.profileFormData.options.hidden != $sessionStorage.user.profile.hidden){
			console.log("Options have changed");
			$scope.profiePromise[4] = UserControlService.updateUserOptions($scope.profileFormData.options, $sessionStorage.user.userInfo.profile_id, $sessionStorage.user.token).then(function(data){
				$sessionStorage.user.profile = data.profile;
				if($scope.optionsAlert){
					$scope.optionsError = "";
					$scope.optionsAlert = false;
				}
			});
		}else{
			console.log("Options are not changed");
			$scope.optionsError = "No changes have been made to Options.";
			$scope.optionsAlert = true;

		}
	}
})

angular.module("app").controller('Favorite', function($scope, $location, $rootScope, $localStorage, CountryFactory, $sessionStorage, UserControlService, ProfileServices){

	$rootScope.url = $location.path();
	$scope.profileData = [];
	$scope.countryData = [];
	$scope.modalShown = false;
	$scope.profileIndex = 0;
	$scope.profileAverage = 0;
	$scope.countryEmoji = "";
	$scope.countryName = "";
	$scope.images = [];
	$scope.direction = 'left';
	$scope._Index = 0;
	$scope.profileFav = false;
	$scope.profiePromise = [];

	console.log($scope.profileData);

	$scope.removeFavourite = function(index){
		if(index != undefined){
			$scope.removeIndex = index;
		}else{
			$scope.removeIndex = $scope.profileIndex
		}
		ProfileServices.removeFavourite($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[$scope.removeIndex].profile_id).then(function(){
			$scope.profileData.splice(index, 1);
			$scope.profileFav = false;
		})
	}

  $scope.toggleModal = function(index) {
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
							console.log("Complete");
						})
					}
			}
		};
		if(index != undefined){
			$scope.profileIndex = index
			$scope.images = $scope.profileData[index].images;
			$scope.profileAverage = $scope.profileData[index].avg;
			$scope.slider.value = $scope.profileData[index].rating;
			$scope.countryEmoji = $scope.profileData[index].countryEmoji;
			$scope.countryName = $scope.profileData[index].countryName;
			$scope.profileFav = true;
		}
    $scope.modalShown = !$scope.modalShown;
  };

	$scope.profiePromise[0] = ProfileServices.findAllFavourite($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id).then(function(favData){
		if(favData != 'false'){
			$.each(favData, function(index, value){
				$scope.profiePromise[1] = ProfileServices.getProfileData($sessionStorage.user.token, value.fav_profile_id).then(function(data){
					$scope.profileData.push(data[0]);
					if(index + 1 >= favData.length){
						$.each($scope.profileData, function(profileIndex, profileValue){
							$scope.profiePromise[2] = ProfileServices.getProfilePics($scope.profileData[profileIndex].profile_id, $sessionStorage.user.token).then(function(data){
								// console.log($scope.profileData[profileIndex].profile_id);
								// console.log(data);
								$scope.profileData[profileIndex].images = [];
								$.each(data, function(imageIndex, imageValue){
									$scope.profileData[profileIndex].images[imageIndex] = 'data:image/JPEG;base64,'+ imageValue.image;
								});
							});
							$scope.profiePromise[3] = ProfileServices.getRating($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id, $scope.profileData[profileIndex].profile_id).then(function(data){
								// console.log(data);
								if(data != 0){
									$scope.profileData[profileIndex].rating = data[0].rate_amount;
								}else{
									$scope.profileData[profileIndex].rating = 0;
								}
							});
							$scope.profiePromise[4] = ProfileServices.getAverage($sessionStorage.user.token, $scope.profileData[profileIndex].profile_id).then(function(data){
								$scope.profileData[profileIndex].avg = data.replace("'", "").replace("'", "");
							});
							//Getting country data to display.
							CountryFactory.then(function(data){
								$scope.countryData = data;
								//Find country data
								$.each($scope.countryData, function(key, value){
									if($scope.profileData[profileIndex].country == value.alpha2 || $scope.profileData[profileIndex].country == value.alpha3){
										$scope.profileData[profileIndex].countryEmoji = value.emoji;
										$scope.profileData[profileIndex].countryName = value.name;
									}
								});
							});
						});
					}
			});
		});
		}else{
			console.log("error");
		}
	});

})
angular.module("app").controller('StatusController', function($scope, $location, $rootScope, $localStorage, $sessionStorage, CountryFactory, ProfileServices){
	$scope.profileStatus = [];
	$scope.avg;
	$scope.favData;
	$scope.count = [];
	$scope.chartLabels = [];
	$scope.chartData = [];
	$scope.profiePromise = [];
	$scope.allowRating = $sessionStorage.user.profile.allow_rating;
	$scope.noRatings = false;

	$("chart").hide();

	CountryFactory.then(function(data){
		$scope.countryData = data;
	});

	var test = function(){
		//Will noe sort the data
		var lable = false;
		$.each($scope.countryData, function(countryIndex, countryValue){
			$.each($scope.profileStatus, function(profileIndex, profileValue){
				lable = false;
				if(profileValue.profileData.country == countryValue.alpha2 || profileValue.profileData.country == countryValue.alpha3){
					if($scope.chartLabels.length > 0 && $scope.chartData.length > 0){
						$.each($scope.chartLabels, function(lableIndex, lablevalue){
							if(countryValue.name == lablevalue){
								$scope.count[lableIndex] += 1;
								lable = true;
								$scope.chartData[lableIndex] += profileValue.rate_amount;
							}
						});
						if(!lable){
							$scope.count.push(1);
							$scope.chartLabels.push(countryValue.name);
							$scope.chartData.push(profileValue.rate_amount);
						}
					}else{
						$scope.count.push(1);
						$scope.chartLabels.push(countryValue.name);
						$scope.chartData.push(profileValue.rate_amount);
					}
				}
			});
			if(countryIndex + 1 == $scope.countryData.length){
				$.each($scope.chartData, function(chartIndex, chartValue){
					$scope.chartData[chartIndex] = $scope.chartData[chartIndex] / $scope.count[chartIndex];
				});
				$("chart").show();
			}
		});
	}

	$scope.profiePromise[0] = ProfileServices.getAllRating($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id).then(function(statusData){
		$scope.profileStatus = statusData;
		console.log($scope.profileStatus);
		if($scope.profileStatus != "false"){
			$scope.noRatings = false;
			$.each($scope.profileStatus, function(index, value){
				$scope.profiePromise[1] = ProfileServices.getProfileData($sessionStorage.user.token, value.profile_id).then(function(profileData){
					// console.log(profileData);
					$scope.profileStatus[index].profileData = profileData[0];

				}, function(err){
					console.log(err);
				}).finally(function(){
					if(index + 1 >= $scope.profileStatus.length){
						test();
					}
				});
			});
		}else{
			console.log("None");
			$scope.noRatings = true;
		}
	}, function(err){
		console.log(err);
	});

	$scope.profiePromise[2] = ProfileServices.getFavAmount($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id).then(function(favData){
		$scope.favData = favData;
	});

	$scope.profiePromise[3] = ProfileServices.getAverage($sessionStorage.user.token, $sessionStorage.user.userInfo.profile_id).then(function(average){
		$scope.avg = average.replace("'", "").replace("'", "");
	})
});
