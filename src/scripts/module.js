angular.module('devfest', ['ngRoute', 'templates', 'ngAnimate'])
.config(function($routeProvider) {
	$routeProvider
		.when('/info', {
			controller: '',
			templateUrl: 'home.html'
		})
		.when('/programm', {
			controller: '',
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