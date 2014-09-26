angular.module('devfest')
.controller('registrationController', function($scope) {

	$scope.loading = true;

	$scope.onIframeLoaded = function() {
		$scope.loading = false;
	};

});