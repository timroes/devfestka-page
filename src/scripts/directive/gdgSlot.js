angular.module('devfest')
.directive('gdgSlot', function(ngDialog) {

	var COLORS = {
		'Audimax': 'color1', 
		'A266': 'color2',
		'A268': 'color3'
	};

	return {
		restrict: 'E',
		scope: {
			'session': '='
		},
		templateUrl: 'directives/gdgSlot.html',
		replace: true,
		link: function(scope) {

			scope.showDetails = function() {
				if(scope.session.title && scope.session.room) {
					ngDialog.open({
						template: 'directives/detailDialog.html',
						scope: scope
					});
				}
			};

			scope.roomColor = function() {
				return COLORS[scope.session.room];
			};
		}
	};

});