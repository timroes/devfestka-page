angular.module('devfest')
.filter('join', function() {
	return function(input, param) {
		var separator = param || ' ';
		return typeof(input) === 'string' ? input : input.join(separator);
	};
});