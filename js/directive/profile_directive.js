angular.module('app').directive('profileView', function(){
	return {
		restrict: "AE",
		replace: "true",
		templateUrl: "views/profile-view.html"
	};
})
