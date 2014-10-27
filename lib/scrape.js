var request = require('request'),
	Q = require('q'),
	cheerio = require('cheerio'),
	_ = require('lodash'),
	url = require('url'),
	searchUrl = 'http://appsrv.pace.edu/ScheduleExplorerlive/index.cfm',
	courseNumbersUrl = 'https://appsrv.pace.edu/ScheduleExplorerlive/getcoursenumbers.cfm?subject=',
	courseInfoUrl = 'https://appsrv.pace.edu/ScheduleExplorerlive/section.cfm',
	ratingBaseUrl = 'http://www.ratemyprofessors.com/search.jsp?query1=',
	ratingAppendedUrl = '&queryoption1=TEACHER&search_submit1=Search',
	subjectsUrl = 'http://appsrv.pace.edu/ScheduleExplorerlive/getsubjects.cfm?';

function fetch (options) {
	var defer = Q.defer();

	request(options, function (error, response, body) {
		if (error) defer.reject(error);
		defer.resolve(body);
	});

	return defer.promise;
}

function expandDays (text) {

	var newText = text;

	newText = newText.replace('M', 'Monday ');
	//console.log(newText);
	newText = newText.replace('T', 'Tuesday ');
	newText = newText.replace('W', 'Wednesday ');
	newText = newText.replace('R', 'Thursday ');
	newText = newText.replace('F', 'Friday ');
	newText = newText.replace('S', 'Saturday ');
	newText = newText.replace('U', 'Sunday ');
	newText = newText.replace(' ', ' & ');

	if (newText.length > 2 && newText.substring(newText.length - 2) == '& ') {
		newText = newText.substring(0, newText.length - 2);
	}

	
	return newText;
}

function expandShortcuts (text) {
	var newText = text;
	console.log(text)
	switch (text) {
		case "NYC": 
			newText = "New York City";
			break;
		case "PLV": 
			newText = "Pleasantville";
			break;
		case "WP": 
			newText = "White Plains";
			break;
		case "GC": 
			newText = "Graduate Center";
			break;
		case "MT": 
			newText = "Midtown Center";
			break;
		case "OC": 
			newText = "Off Campus";
			break;
		case "All Subjects (This May Take A Few Minutes)":
			newText = "All";
			break;
	}



	return newText;

}

function parseTotalResults ($) {
	var el, matches;

	el = $('.body p strong')
		.filter(function () {
			return $(this).text().indexOf('Displaying') === 0;
		})
		.first();

	matches = el.text().match(/ of (\d+)/);

	if (!matches) return 0;
	return parseInt(matches[1], 10);
}

var parseTable = (function () {

	var defaultParser, typeParsers, parsers;

	defaultParser = {
		parse: function (el) {
			return el.text();
		},
		fromString: function (string) {
			return string;
		}
	};

	typeParsers = {
		'int': function (string) {
			return parseInt(string, 10) || 0;
		}
	};

	parsers = {
		'0': 'crn',
		'1': 'subject',
		'2': 'course_number',
		'3': 'title',
		'4': 'sched_type',
		'5': 'credits:int',
		'6': 'campus',
		'7': 'section_comments',
		'8': 'days',
		'9': {
			id: 'time',
			parse: function (el) {
				el.children().remove();
				return el.text();
			}
		},
		'10': 'capacity:int',
		'11': 'seats_available:int',
		'12': 'instructor_name'
	};

	return function (el, $) {
		return _.map(el.find('tbody tr') , function (el, i) {
			var course = {};
			
			_.each($(el).children('th'), function (el, i){
				var parser, text, split, type;

				parser = parsers[i.toString()];

				if (typeof parser === 'string') {
					parser = {
						id: parser
					};
				}

				if (!parser) return;

				split = parser.id.split(':');

				parser.id = split[0];
				type = split[1];

				if (type) parser.toString = typeParsers[type];

				parser = _.extend({}, defaultParser, parser);

				text = parser.parse($(el));
				text = text.trim();
				text = parser.fromString(text);

				if (parser.id == 'days') {
					text = expandDays(text);
				} else {
					text = expandShortcuts(text);
				}

				course[parser.id] = text;
			});

			return course;
		});
	};
}());



module.exports = {
	getSearchOptions: function () {
		return fetch(searchUrl)
			.then(function (html) {
				// Success
				var $ = cheerio.load(html);
				return {
					term: parseSelectOptions($('select[name="term"]'), true),
					level: parseSelectOptions($('select[name="level"]'), true, null, 'Undergraduate'),
					subject: parseSelectOptions($('select[name="subject"]'), true, 'all', 'all'),
					professor: parseSelectOptions($('select[name="professor"]'), false, 'x', 'x'),
					location: parseSelectOptions($('select[name="location"]'), false, 'x', 'x'),
					time: parseSelectOptions($('select[name="time"]'), false, 'x', 'x'),
					day: parseSelectOptions($('select[name="day"]'), false, 'x', 'x'),
					aok: parseSelectOptions($('select[name="AOK"]'), false, 'x', 'x'),
					coursenumber: parseSelectOptions($('select[name="coursenumber"]'), false, 'x', 'x')
				};

				function parseSelectOptions(el, required, allowAllKey, defaultKey) {
					var children = el.children().filter(function (i, el){
						return !!$(el).val();
					});
					
					var options = {};

					if (required) {
						options.required = true;
					} else {
						options.required = false;
					}

					if (defaultKey !== null) {
						options.default = defaultKey;
					}

					if (allowAllKey) {
						options[allowAllKey] = "All";
					}


					_.each(children, function (el) {
						el = $(el);
						options[el.val().replace('|', '|')] = expandShortcuts(el.text().trim());
						
						
					});

					// return _.map(children, function (el) {
					// 	el = $(el);
					// 	return {
					// 		value: el.val(),
					// 		name: el.text().trim()
					// 	};
					// });

					return options;
				}
			});
	},

	/*
	{
		total: int,
		results: [{
			key: value
		}]
	}
	*/
	getSearchResults: function (parameters) {
		return fetch({
			url: searchUrl,
			qs: parameters
		}).then(function (html) {
			var $ = cheerio.load(html),
				tableEl = $('#yuidatatable1 table');

			return {
				total: parseTotalResults($),
				results: parseTable(tableEl, $)
			};
		});
	},

	getCourseNumbers: function (subject) {
		return fetch(courseNumbersUrl + subject)
			.then(function (html){
				var $ = cheerio.load(html);
				return _.map($('select option'), function (el){
					return $(el).val();
				});
			});
	},

	getCourseInfo: function (courseId, term) {
		return fetch({
			url: courseInfoUrl,
			qs: {
				"crn": courseId,
				"term": term
			}
		})
		.then(function (html) {
			var $ = cheerio.load(html),
				list,
				data;
			list = _.map($('table'), function (el, i){
				return _.map($(el).children('tr'), function (el, i){
					return _.map($(el).children('td'), function (el, i){
						return $(el).text().trim().replace('\r','').replace('\n','');
					});
				});
			});

			data = {
				"school" : list[0][2][1],
				"department" : list[0][3][1],
				"corequisite" : list[0][5][1],
				"prerequisite" : list[0][6][1],
				"description" : list[0][7][1],
				"campus" : list[1][4][1],
				"required_material" : list[1][6][1],
				"section_comments" : list[1][7][1],
				"attributes" : list[1][9][1],
				"fees" : list[1][10][1],
				"address" : list[2][1][2],
				"date" : list[2][1][3]
			};

			return data;
		});
	},

	getSubjects: function (term, level) {
		return fetch({
			url: subjectsUrl,
			qs: {
				'r': term,
				'level': level
			}
		})
		.then(function (html){
			var $ = cheerio.load(html),
				obj = {};
			_.each($('select option'), function (el){
				var value;
				
				el = $(el);
				value = el.val();

				if (!value || value === 'all') return;
				
				obj[value] = el.text();
			});
			return obj;
		});
	},

	getProfessorRating: function (name) {
		var theurl = 'http://www.ratemyprofessors.com/search.jsp?query1=david+benjamin+pace&queryoption1=TEACHER&search_submit1=Search&prerelease=true';
		var urlold = ratingBaseUrl+name.substring(1,name.length)+ratingAppendedUrl;
		return fetch({
			url : theurl
		})
			.then(function (html){
				$ = cheerio.load(html);
				return html;
			});
	}
};