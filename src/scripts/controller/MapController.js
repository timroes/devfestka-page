angular.module('devfest')
.controller('MapController', function($scope, $timeout) {

	var justClicked = false;
	var firstActivation = true;

	$scope.eventLocation = {
		latitude: <%= event.location.coords.lat %>,
		longitude: <%= event.location.coords.lng %>
	};

	$scope.mapCenter = {
		latitude: <%= event.location.map_center.lat %>,
		longitude: <%= event.location.map_center.lng %>
	};

	$scope.mapOptions = {
		disableDefaultUI: true,
		scrollwheel: false,
		draggable:false
	};

	$scope.showInfo = function() {
		$scope.infoMinimized = false;
		$scope.mapOptions.draggable = $scope.mapOptions.scrollwheel = false;
	};

	$scope.infoMinimized = false;

	$scope.activateMap = function(ev) {
		if (!justClicked && !$scope.infoMinimized) {
			ev.preventDefault();
			ev.stopPropagation();
			$scope.mapOptions.draggable = $scope.mapOptions.scrollwheel = true;
			$scope.infoMinimized = true;
			justClicked = true;

			if(firstActivation) {
				// On first activation of map move event location to center
				$scope.mapCenter = angular.copy($scope.eventLocation);
				firstActivation = false;
			}

			$timeout(function() {
				justClicked = false;
			}, 100);
		}
	};

});