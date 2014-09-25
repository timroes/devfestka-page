angular.module('devfest')
.controller('navigationController', function($scope) {

	$scope.menu = [
		{ url: '/info', label: 'Informationen' },
		{ url: '/programm', label: 'Programm' },
		{ url: '/impressum', label: 'Impressum' }
	];

});