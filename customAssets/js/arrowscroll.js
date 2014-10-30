$('.arrow-down').click(function(event) {
	event.preventDefault();
	var pos = $($(this).attr('href')).position().top;
	$('html, body').animate({scrollTop: pos}, 300);
});