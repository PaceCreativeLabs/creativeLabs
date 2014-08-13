$(document).ready(function(){
	var $projectList = $('#projectList');
	
	$.getJSON('../projectsInfo.json', function(result){
		console.log("== [ $.getJSON - Success ] ==");
		$.each(result.projects, function(key, value){
			$projectList.append('<li class="col-md-2 text-center" data-os-animation="" data-os-animation-delay="">'+
				'<div class="box-round box-medium">'+
					'<div class="box-dummy"></div>'+
					'<a class="box-inner" href="javascript:void(0)">'+
						'<img alt="' + value.identifier + '" src="' + value.imgUrl + '" onclick="moreInfo(this)">'+
					'</a>'+
				'</div>'+
				'<h3 class="text-center">'+
					'<a href="javascript:void(0)">' + value.projectTitle + '</a>'+
				'</h3>'+
			'</li>');
		});
	}).fail(function(jqxhr, textStatus, error){
		var err = textStatus + ', ' + error;
		console.log("== [ Request Failed: " + err + " ] ==");
	});
});