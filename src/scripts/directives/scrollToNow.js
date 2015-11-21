(function() {

var timeAnchors = [];

angular.module('devfest')
.directive('scrollToNow', function($document, $window) {
	return {
		restrict: 'E',
		templateUrl: 'views/directives/scrollToNow.html',
		scope: {},
		controller: function($scope) {

			$document.bind('scroll', function(ev) {
				if ($window.pageYOffset > 500) {
					$scope.hideScrollLink = true;
					$document.unbind('scroll');
					$scope.$digest();
				}
			});

			$scope.scroll = function() {
				if (timeAnchors.length < 1) return;

				var now = new Date();
				var anchorToScroll = timeAnchors[0];
				for(var i in timeAnchors) {
					var anchor = timeAnchors[i];
					if (anchor.time > now) {
						break;
					}
					anchorToScroll = anchor;
				}

				$document.scrollToElementAnimated(anchorToScroll.element, 42);
				$scope.hideScrollLink = true;

			};
		}
	};
})
.directive('timeAnchor', function() {
	return {
		restrict: 'A',
		scope: {
			timeAnchor: '@'
		},
		link: function(scope, elem) {
			timeAnchors.push({
				time: new Date(scope.timeAnchor),
				element: elem
			});
		}
	};
});

})();