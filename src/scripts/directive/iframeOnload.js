angular.module('devfest')
.directive('iframeOnload', function() {

	return {
		scope: {
			onload: '&iframeOnload'
		},
		link: function(scope, element) {
			element.on('load', function() {
				scope.$apply(function() {
					return scope.onload();
				});
			});
		}
	};

});