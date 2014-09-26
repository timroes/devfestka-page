angular.module('devfest')
.directive('gdgLoading', function() {

	return {
		restrict: 'E',
		template: '<div class="gdg_loading"><div></div> <div></div> <div></div></div>',
		replace: true
	};

});