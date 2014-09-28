angular.module('devfest')
.controller('scheduleController', function($http, $scope) {

	$http.get('assets/schedule.json').then(function(response) {
		$scope.schedule = response.data;
	});

});