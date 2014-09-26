$(function() {
	// Ripple animations on menu
	$('#menu a').mouseenter(function(e) {
		var link = $(this);
		if(link.find('.ripple').length === 0) {
			link.append('<span class="ripple" style="background-color: ' + link.css('color') + '"></span>');
		}

		var rip = link.find('.ripple');

		if(!rip.height() && !rip.width()) {
			d = Math.max(link.outerWidth(), link.outerHeight());
			rip.css({ height: d, width: d});
		}
		var x = e.pageX - link.offset().left - rip.width() / 2;
		var y = e.pageY - link.offset().top - rip.height() / 2;

		rip.css({ top: y + 'px', left: x + 'px'});
	});

	// Sticky menu
	var menuPos = $('#menu').offset().top;
	var sticky = function() {
		var scrollTop = $(window).scrollTop();
		if(scrollTop >= menuPos) {
			$('#menu').addClass('sticky');
			$('body').addClass('sticky');
		} else {
			$('#menu').removeClass('sticky');
			$('body').removeClass('sticky');
		}
	};

	sticky();

	$(window).scroll(sticky);

	var START = 1414222200000; // 25.10.2014 9:30 [ms]
	var container = $('#countdown');
	var refreshClock = function() {
		var left = Math.floor((START - Date.now()) / 1000);
		var leftb = left.toString(2);
		var i;

		if(left <= 0) {
			container.empty();
			return;
		}

		// Initialize bullets (or reset when number of digits changed)
		if(container.find('div').length === 0 || container.find('div').length > leftb.length) {
			container.empty();
			for(i = 0; i < leftb.length; i++) {
				container.append('<div></div>');
			}
		}

		var bullets = container.find('div');
		for(i = 0; i < leftb.length; i++) {
			if(leftb[i] === "1") {
				$(bullets.get(i)).removeClass('off');
			} else {
				$(bullets.get(i)).addClass('off');
			}
		}

		container.attr('title', 'Noch ' + left + ' (' + leftb + 'b) Sekunden bis zum DevFest 2014!');

		setTimeout(refreshClock, 999);
	};
	setTimeout(refreshClock, 0);
});