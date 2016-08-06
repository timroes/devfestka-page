angular.module('devfest')
.controller('SponsorController', function(localStorageService) {

	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	var seed = localStorageService.get('random.seed');
	if (!seed) {
		seed = Date.now();
		localStorageService.set('random.seed', seed);
	}

	// Seed Math.random with the given seed for randomizing sponsors for each
	Math.seedrandom(seed);

	this.sponsors = <%= JSON.stringify(sponsors) %>;
	this.sponsors.forEach(function(group) {
		// Shuffle sponsors within one group
		shuffle(group.sponsors);
	});

	Math.seedrandom();

});
