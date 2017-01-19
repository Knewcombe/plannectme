angular.module('app').directive('adBar', function(){
	return {
		restrict: "AE",
		replace: "true",
		templateUrl: "views/ad_bar.html"
	};
})
