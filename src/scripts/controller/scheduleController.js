angular.module('devfest')
.controller('scheduleController', function($http, $scope, $filter, ngDialog, event) {

	var descriptions = {
		<%
		var sched = schedule.show == 'current' ? schedule_current : schedule_previous;
		_.forEach(sched, function(day) {
			_.forEach(day.slots, function(slot) {
				_.forEach(slot.sessions, function(sess) {
					if (sess.title && sess.room) { %>

						'<%= idfor(sess.title) %>': {
							title: '<%= esc(sess.title) %>',
							speaker: '<%= esc(sess.speaker) %>',
							speakerlink: '<%= esc(sess.speakerlink) %>',
							speakerdesc: '<%= esc(text(sess.speakerdesc)) %>',
							room: '<%= esc(sess.room) %>',
							lang: '<%= esc(sess.lang) %>',
							abstract: '<%= esc(text(sess.abstract)) %>',
							slides: '<%= esc(sess.slides) %>',
							audience: '<%= esc(sess.audience) %>',
							video: '<%= esc(sess.video) %>'
						},

		<%			}
				});
			});
		}); %>
	};

	$scope.showDetails = function(forId) {
		if (forId in descriptions) {
			ngDialog.open({
				template: 'views/directives/detailDialog.html',
				data: descriptions[forId],
				controller: 'DetailDialogController',
				disableAnimation: true
			});
		}
	};

	$scope.showScrollToNow = event.isToday();

});
