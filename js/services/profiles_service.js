angular.module("app").service('ProfileServices', ['$localStorage', '$sessionStorage', '$q', '$http', '$rootScope', 'API_CONN' ,'Upload', '$location', function ($localStorage, $sessionStorage, $q, $http, $rootScope, API_CONN, Upload, $location) {

	this.getProfiles = function(token, profileId, profileData){
		//This will gather a list of profiles to show the user.
		var deferred = $q.defer();
		console.log("Profile");
		var request = [{
			'profileId': profileId
		}]
		if(profileData.length > 0){
			$.each(profileData, function(key, value){
				request.push({'profileId': value.profile_id});
			});
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/getProfiles?token="+token, request)
		.success(function(data) {
					if(data.success == false){
						console.log("Token is not valid");
						$sessionStorage.user = null;
						$location.path("/signin");
					}else{
						console.log("Token valid");
						deferred.resolve(data);
					}
		    })
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.getProfilePics = function(profileId, token){
		var deferred = $q.defer();
		console.log("Profile "+profileId);
		var request = {
			'profileId': profileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/download?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					console.log("Token is not valid");
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					console.log("Token valid");
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.uploadProfilePics = function(profileId, token, images){
		console.log(token);
		var deferred = $q.defer();
		Upload.upload({
							url: API_CONN.NODE_SERVER+'/api/profiles/upload?profileId='+profileId+'&token='+token, //webAPI exposed to upload the file
							method: 'POST',
							arrayKey: '', // default is '[i]'
							data:{file:images} //pass file as data, should be user ng-model
					}).then(function (resp) { //upload function returns a promise
							if(resp.data.error_code === 0){ //validate success
									console.log('Success ' + resp.status + ' uploaded. Response: ');
									deferred.resolve();
							} else {
									console.log('an error occured');
									deferred.reject();
							}
					}, function (resp) { //catch error
							console.log('Error status: ' + resp.status);
							$sessionStorage.user = null;
							$location.path("/error");
					}, function (evt) {
							console.log(evt);
							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							//console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
							var progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
							deferred.notify(progress);
					});
					return deferred.promise;
	}

	this.updatePhotos = function(token, profileId, images, pictureId){
		console.log(profileId);
		var deferred = $q.defer();
		Upload.upload({
							url: API_CONN.NODE_SERVER+'/api/profiles/update_images?profileId='+profileId+'&token='+token+'&pictureId='+pictureId, //webAPI exposed to upload the file
							method: 'POST',
							arrayKey: '', // default is '[i]'
							data:{file:images}
					}).then(function (resp) { //upload function returns a promise
							if(resp.data.error_code === 0){ //validate success
									console.log('Success ' + resp.status + ' uploaded. Response: ');
									if(resp.status){
										console.log("Token is not valid");
										$sessionStorage.user = null;
										$location.path("/signin");
									}else{
										console.log("Token valid");
										deferred.resolve();
									}
							} else {
									console.log('an error occured');
									deferred.reject();
							}
					}, function (resp) { //catch error
							console.log('Error status: ' + resp.status);
							$sessionStorage.user = null;
							$location.path("/error");
					}, function (evt) {
							console.log(evt);
							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							//console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
							var progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
							deferred.notify(progress);
					});
					return deferred.promise;
	}

	this.rateProfile = function(token, profileId, rateProfileId, value){
		var deferred = $q.defer();
		console.log("Rate");
		var request = {
			'profileId': profileId,
			'rateProfileId': rateProfileId,
			'value': value
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/rate_profile?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					console.log("Token is not valid");
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					console.log("Token valid");
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.getAverage = function(token, profileId){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/profile_average?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					console.log("Token is not valid");
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					console.log("Token valid");
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.getRating = function(token, profileId, rateProfileId){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId,
			'rateProfileId': rateProfileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/profile_rating?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					console.log("Token is not valid");
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					console.log("Token valid");
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.favouriteProfile = function(token, profileId, favProfile){
		var deferred = $q.defer();
		console.log("Rate");
		var request = {
			'profileId': profileId,
			'favProfile': favProfile
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/favourite_profile?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					console.log("Token is not valid");
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					console.log("Token valid");
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.removeFavourite = function(token, profileId, favProfile){
		var deferred = $q.defer();
		console.log("Rate");
		var request = {
			'profileId': profileId,
			'favProfile': favProfile
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/favourite_remove?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.findFavourite = function(token, profileId, favProfile){
		var deferred = $q.defer();
		console.log("findFavourite");
		var request = {
			'profileId': profileId,
			'favProfile': favProfile
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/favourite_find?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.findAllFavourite = function(token, profileId){
		var deferred = $q.defer();
		console.log("Find all Favourie");
		var request = {
			'profileId': profileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/favourite_find_all?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.getAllRating = function(token, profileId){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/get_all_ratings?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.getProfileData = function(token, profileId){
		var deferred = $q.defer();
		// console.log("Profile: " +profileId);
		var request = {
			'profileId': profileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/get_profile_data?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}

	this.getFavAmount = function(token, profileId){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/get_favouite_amount?token="+token, request)
		.success(function(data) {
				if(data.success == false){
					$sessionStorage.user = null;
					$location.path("/signin");
				}else{
					deferred.resolve(data);
				}
			})
		    .error(function(data) {
					$sessionStorage.user = null;
					$location.path("/error");
		    });
		return deferred.promise;
	}
}]);
