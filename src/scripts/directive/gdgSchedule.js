angular.module('devfest')
.directive('gdgSchedule', function() {

	return {
		restrict: 'E',
		scope: {
			'schedule': '='
		},
		templateUrl: 'directives/gdgSchedule.html',
		replace: true
	};

});