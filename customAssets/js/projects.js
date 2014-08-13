$(document).ready(function(){
	var $projectList = $('#projectList')
	var $projectTitle = $('#projectTitle');
	var $imgUrl = $('#imgUrl');
	var $descriptionTitle = $('#descriptionTitle');
	var $description = $('#description');
	var $urlText = $('#urlText');
	$('#projectList a').click(function(){
		console.log("== [ Click alert fired off ] ==")
		var identifier = $(this).getAttribute('alt');
		console.log("== [ Value of this images alt " + identifier + " ] ==");
		$getJSON('../projectsInfo.json', function(result){
			$.each(result.projects, function(key, value){
				if(value.identifier == identifier){
					console.log("== [ Identifier recognized ] ==")
					var content = $description.text();
					if(content.length > 0){
						console.log("== [ Existing content recognized ] ==")
						$projectTitle.empty().html(value.projectTitle);
						$imgUrl.empty.setAttribute('src', value.imgUrl);
						$descriptionTitle.empty().html(value.descriptionTitle);
						$description.empty().html(value.description);
						$urlText.empty().setAttribute('href', value.urlText);
						$urlText.empty().html(value.urlText);
					}else{
						$projectTitle.html(value.projectTitle);
						$imgUrl.tAttribute('src', value.imgUrl);
						$descriptionTitle.html(value.descriptionTitle);
						$description.html(value.description);
						$urlText.setAttribute('href', value.urlText);
						$urlText.html(value.urlText);
					}
				}
			});
		});
	});
	$.getJSON('../projectsInfo.json', function(result){
		console.log("== [ $.getJSON - Success ] ==")
		$.each(result.projects, function(key, value){
			$projectList.append('<li class="col-md-4 text-center" data-os-animation="" data-os-animation-delay=""><div class="box-round box-medium"><div class="box-dummy"></div><a class="box-inner" href="#"><img src="' + value.imgUrl + '" alt="' + value.identifier + '"></a></div><h3 class="text-center"><a href="#">' + value.projectTitle + '</a></h3></li>');
		});
	}).fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ', ' + error;
		console.log("== [ Request Failed: " + err + " ] ==");
	});
});