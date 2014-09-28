angular.module('devfest', ['ngRoute', 'templates', 'ngAnimate', 'ngDialog'])
.config(function($routeProvider) {
	$routeProvider
		.when('/info', {
			controller: '',
			templateUrl: 'home.html'
		})
		.when('/programm', {
			controller: 'scheduleController',
			templateUrl: 'programm.html'
		})
		.when('/impressum', {
			controller: '',
			templateUrl: 'impressum.html'
		})
		.when('/anmeldung', {
			controller: 'registrationController',
			templateUrl: 'anmeldung.html'
		})
		.otherwise({
			redirectTo: '/info'
		});
});