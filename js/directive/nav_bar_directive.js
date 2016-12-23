angular.module('app').directive('navHeader', function(){
	return {
		restrict: "AE",
		replace: "true",
		templateUrl: "views/header.html"
	};
})
