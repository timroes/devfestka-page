angular.module('devfest', ['ngRoute', 'templates', 'ngAnimate', 'ngDialog', 'ngSanitize', 'uiGmapgoogle-maps', 'duScroll'])
.config(function($routeProvider, $locationProvider, eventProvider) {
	$locationProvider.html5Mode({
		enabled: true
	});
	$routeProvider
		.when('/info', {
			controller: '',
			templateUrl: 'views/home.html'
		})
		.when('/programm', {
			controller: 'scheduleController',
			templateUrl: 'views/schedule.html'
		})
		.when('/impressum', {
			controller: '',
			templateUrl: 'views/impressum.html'
		})
		.otherwise({
			redirectTo: eventProvider.isToday() ? '/programm' : '/info'
		});
})
.config(function(uiGmapGoogleMapApiProvider) {
	uiGmapGoogleMapApiProvider.configure({
		key: 'AIzaSyCeitR0kJANP23RhVw-c6YyKvIV8jT1u04'
	});
})
.config(function($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
})
.run(function($rootScope, ngDialog) {
	$rootScope.$on('$locationChangeStart', function() {
		ngDialog.closeAll();
	});
});