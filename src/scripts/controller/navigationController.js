angular.module('devfest')
.controller('navigationController', function($scope) {

	$scope.menu = [
		{ url: '/info', label: 'Informationen' },
		{ url: '/anmeldung', label: 'Anmeldung' },
		{ url: '/programm', label: 'Programm' },
		{ url: '/impressum', label: 'Impressum' }
	];

	$scope.showNavigation = false;

	$scope.toggleNavigation = function(ev) {
		ev.preventDefault();
		$scope.showNavigation = !$scope.showNavigation;
	};

});