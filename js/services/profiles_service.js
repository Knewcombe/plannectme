angular.module("app").service('ProfileServices', ['$localStorage', '$sessionStorage', '$q', '$http', '$rootScope', 'API_CONN' ,'Upload', '$location', function ($localStorage, $sessionStorage, $q, $http, $rootScope, API_CONN, Upload, $location) {

	this.getProfiles = function(token, profileId, country, profileData, searchOptions){
		//This will gather a list of profiles to show the user.
		var deferred = $q.defer();
		var request = {
			'profileId': [profileId],
			'requestCountry': country,
			'searchOptions': searchOptions
		}
		if(profileData.length > 0){
			$.each(profileData, function(key, value){
				request.profileId.push(value.profile_id);
			});
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/getProfiles?token="+token, request)
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

	this.getProfilePics = function(profileId, token){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/download?token="+token, request)
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

	this.uploadProfilePics = function(profileId, token, images){
		var deferred = $q.defer();
		Upload.upload({
							url: API_CONN.NODE_SERVER+'/api/profiles/upload?profileId='+profileId+'&token='+token, //webAPI exposed to upload the file
							method: 'POST',
							arrayKey: '', // default is '[i]'
							data:{file:images} //pass file as data, should be user ng-model
					}).then(function (resp) { //upload function returns a promise
							if(resp.data.error_code === 0){ //validate success
									deferred.resolve();
							} else {
									deferred.reject();
							}
					}, function (resp) { //catch error
							$sessionStorage.user = null;
							$location.path("/error");
					}, function (evt) {
							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							var progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
							deferred.notify(progress);
					});
					return deferred.promise;
	}

	this.updatePhotos = function(token, profileId, images, pictureId){
		var deferred = $q.defer();
		Upload.upload({
							url: API_CONN.NODE_SERVER+'/api/profiles/update_images?profileId='+profileId+'&token='+token+'&pictureId='+pictureId, //webAPI exposed to upload the file
							method: 'POST',
							arrayKey: '', // default is '[i]'
							data:{file:images}
					}).then(function (resp) { //upload function returns a promise
							if(resp.data.error_code === 0){ //validate success
									if(resp.status){
										$sessionStorage.user = null;
										$location.path("/signin");
									}else{
										deferred.resolve();
									}
							} else {
									deferred.reject();
							}
					}, function (resp) { //catch error
							$sessionStorage.user = null;
							$location.path("/error");
					}, function (evt) {
							var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							var progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
							deferred.notify(progress);
					});
					return deferred.promise;
	}

	this.rateProfile = function(token, profileId, rateProfileId, value){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId,
			'rateProfileId': rateProfileId,
			'value': value
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/rate_profile?token="+token, request)
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

	this.getAverage = function(token, profileId){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/profile_average?token="+token, request)
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

	this.getRating = function(token, profileId, rateProfileId){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId,
			'rateProfileId': rateProfileId
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/profile_rating?token="+token, request)
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

	this.favouriteProfile = function(token, profileId, favProfile){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId,
			'favProfile': favProfile
		}
		$http.post(API_CONN.NODE_SERVER+"/api/profiles/favourite_profile?token="+token, request)
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

	this.removeFavourite = function(token, profileId, favProfile){
		var deferred = $q.defer();
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

	this.getProfileData = function(token, profileId, country){
		var deferred = $q.defer();
		var request = {
			'profileId': profileId,
			'requestCountry': country
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
