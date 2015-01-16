$(document).ready(function(){
	$.getJSON('../projectsInfo.json', function(result){
		$.each(result.projects,function(key,value){
			if(value.identifier == whichProject.hash){
				$projectTitle.html(value.projectTitle);
				$description.html(value.description);
				$urlText.html(value.urlText);
				$urlText.attr('href', value.url);
				$urlText.attr('target','_blank');
				$url.attr("href",value.url);
				$visitSite.attr("href",value.url);
				$url.attr("title",value.projectTitle);
				document.getElementById('imgURL').setAttribute('src',value.imgUrl);
			}
		});
	}).fail(function(jqxhr,textStatus,error){
		var err = textStatus + ', ' + error;
		console.log("== [ Request Failed: " + err + " ] ==");
	});
});
var $imgUrl = $('#imgUrl'),
	$projectTitle = $('#projectTitle'),
	$description = $('#description'),
	$urlText = $('#urlText'),
	$url = $('#url'),
	$projectList = $('#projectList'),
	$mainImageDiv = $('#mainImageDiv'),
	$visitSite = $('#visitSite');
function moreInfo(event){
	var identifier = event.getAttribute('data-identifier');
	$.getJSON('../projectsInfo.json', function(result){
		$.each(result.projects,function(key,value){
			if(value.identifier == identifier){
				$projectTitle.empty().html(value.projectTitle);
				$description.empty().html(value.description);
				$urlText.empty().html(value.urlText);
				$urlText.attr('href',value.url);
				$urlText.attr('target','_blank');
				$url.attr("href", value.url);
				$visitSite.attr("href",value.url);
				$url.attr("title", value.projectTitle);
				document.getElementById('imgURL').setAttribute('src', value.imgUrl);
			}
		});
	});
	jQuery('html, body').animate({scrollTop: 0}, 1000);
}
function parseURL(url){
	console.log(url);
	var a=document.createElement('a');
	a.href=url;
	return{hash:a.hash.replace('#','')};
}
whichProject = parseURL(window.location.href);