angular.module('devfest')
.filter('lang', function() {

	var LANGS = {
		'de': 'Deutsch',
		'en': 'English'
	};

	return function(input) {
		return LANGS[input] || input;
	};
});