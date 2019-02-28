var GoTo = function(carouselSlide, navigationTab, idName)
{
	console.log("Called");
	$("#carousel").carousel(carouselSlide);

	if (carouselSlide == 1)
	{
		$('.nav-tabs a[href="#' + navigationTab + '"]').tab('show');
	}
	window.location.hash = idName;
};