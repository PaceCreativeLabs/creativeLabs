$(document).ready(function(){
	var $projectTitle = $('#projectTitle');
	var $imgUrl = $('#imgUrl');
	var $descriptionTitle = $('#descriptionTitle');
	var $description = $('#description');
	var $urlText = $('#urlText');
	var $projectList = $('#projectList')
	$.getJSON('../projectsInfo.json', function(result){
		$.each(result.projects, function(key, value){
			$projectList.append(''
				+'<li class="col-md-4 text-center" data-os-animation="" data-os-animation-delay="">'
				+	'<div class="box-round box-medium">'
				+		'<div class="box-dummy"></div>'
				+		'<a class="box-inner" href="#">'
				+			'<img src="' + value.imgUrl + '">'
				+		'</a>'
				+	'</div>'
				+	'<h3 class="text-center ">'
				+		'<a href="#">' + value.projectTitle + '</a>'
				+	'</h3>'
				+'</li>'
			);
		});
	});
});