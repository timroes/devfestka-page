angular.module('devfest')
.provider('event', function() {

	/**
	 * Returns a boolean whether the event takes place today.
	 */
	var isToday = function() {
	
		var conferenceDays = ['<%= schedule.data.map(function(el) {return date(el.date, "yyyy-mm-dd"); }).join("','") %>'];

		// Get the current date formatted as year-month-day.
		var today = new Date();
		today = today.getFullYear() + '-' + _.padLeft(today.getMonth() + 1, 2, '0') + '-' + _.padLeft(today.getDate(), 2, '0');
		return conferenceDays.indexOf(today) > -1;
	};

	// Make the isToday method available on the provider and the service
	this.isToday = isToday;

	this.$get = function() {
		return {
			isToday: isToday
		};
	};
});