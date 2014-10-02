angular.module('devfest')
.directive('clickBlur', function() {
	return function(scope, element) {
		element.on('click', function() {
			// blurs the element as soon as it got clicked.
			// Used to prevent nasty firefox bugs when hover states remain after
			// click events.
			element.blur();
		});
	};
});