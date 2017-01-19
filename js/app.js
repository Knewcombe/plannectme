angular.module("app", ["ngRoute", "ngStorage", "ngTouch", "ngAnimate", "countrySelect", "ngFileUpload", "rzModule", "chart.js", "cgBusy", "720kb.datepicker", "swipe"]).run(function($rootScope, $location) {
    $rootScope.home = function(){
        $location.path('/');
    };
});
