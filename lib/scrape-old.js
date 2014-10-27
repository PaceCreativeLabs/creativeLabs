var request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash'),
    express = require('express');

var url = 'http://appsrv.pace.edu/ScheduleExplorerlive/index.cfm';

var app = express();

app.get('/professors', function (req, res) {
    getProfessors(function (error, professors) {
        // Pick 10

        professors = _.shuffle(professors).slice(0, 150);

        var images = [],
            loaded = professors.length;

        professors.forEach(function (prof, i) {
            getProfessorPicture(prof.firstName + ' ' + prof.lastName, function (src) {
                images[i] = src;
                --loaded;

                if (loaded <= 0) {
                    var str = '';
                    professors.forEach(function (prof, i) {
                        str += '<img width="40" height="40" src="' + images[i] + '" title="' + prof.firstName + ' ' + prof.lastName + '"/>';
                    });

                    res.send(str);
                }
            });
        });
    });
});

function getProfessors(callback) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(null, parsePage(body));
        } else {
            callback(error);
        }
    });
}

function getProfessorPicture(name, callback) {
    var baseUrl = 'http://whitepages.pace.edu/';

    var out = {
        // __EVENTTARGET:'',
        // __EVENTARGUMENT:'',
        // area_info_ClientState:'{"ActiveTabIndex":0,"TabState":[true,true,true,true,true]}',
        // department_tree_ExpandState:'ecc',
        // department_tree_SelectedNode:'department_treet0',
        // department_tree_PopulateLog:'',
        __VIEWSTATE:'tlIVmnpDWL2OaEyyXfBZ7+bJpZjTkEtXlzFTajBLKQ8gZHyEwBkj0yl4dysy9bHbViifW70DNDxp4CdHr96s+BfI1GVQ/yJCOnpJKB6J7qoK+amSrILfv8t+Lz34mmUjl2AOgjaTxXB0Ps8INQbl3iLfXUXlt946xyB05HgPDOXCa+QzojVbCWl2k2lM0FTs7N8JuDslEIkii7GUPwOSyOtbluk11tmvmL03SiBOdi9TigHvH/rOep+g+jn6oEDYYFG1Ys5BSiZgyfvJ+QwVEImM5HuCMm/veZa3MmYauoNbGrcEyLDOZqcQ+QbaiuTxu2jPHTMFAoqUR6hqHXvinIO6GGy1o87o0HKWbGmrR6YARgwFVYvICtNbgbJLeQ86/d7ttpRW+ShAjoljfRORQhVDLnLl+9x8hjnWBKBTt1NG2KiaUdo0lAmbpSS5QNf8gMAQzhWr6mfFCsPO3iIkax8ndJxwVl9XUmA/V7QvDZTl3LfGT4aYBSFw+jyP7oESr6yVDoqpKCrdtyaTqznNvgua+Y6eR+PLIg6BK7AIEQBjPz9oTKg0pad1NUPcL2voCixzA1y3j5zkHqe9AkMVl4vBTcScd4bt7bpt4EoTCH8ldfm8UJsckHjmLJ2lFjvinWdv4OwMnp94qN/nOiKzGEUAq9r4m9xk9LA7ugk0K7/0KM2qXacFayz2N7/ibbk5JFnBwoaXSSMe1ttENNYaVEXq7TJ86eAc7a9174Pd8ysYFcv4hQ2GdX3zdGL2YRx23dmAZNih8USoqIgYk2XNE28cKLoc7Ibml4lndhSbk7bc2j+mL6DoZhxu5iQxoS4SIhG8XjuU96C92NjaqdusxeCnxyU18C/c5wQBY8QzWUryBoLgDEGiCTs/tuVLLmyhFFwT3pG8jM78l6hqGZAJOqxGHK8+Tf15hEmot8eTJ0rEQi6yq8k6juwyd9U3jv1MAp1DExCAFytd9lKdnNBr9FvoMBvTTs2SMZh9t7RDhoLTzxi5FLSsnT0m5MVzMMXAzVSHfdT851MtcJm1XLyIESGWiYE/eEtZPXZgm2f3Sfo3E+wie+r4LNahCIJDO6jsRQi1wf1I3nn+TtBIlkHyVfhH20NM6bFXCWuZJHf8QkNatN5GrU4drM4HAykb7H8l7sOXZw==',
        __VIEWSTATEENCRYPTED:'',
        __EVENTVALIDATION:'Xl0UCTUHSlHK5iIRSga4kWvw9quLh1NEYpF4EBZF4Q/l8byXKZoMPIJx0teY+eHLiqYzq933kGuraHjquP24qbnYIu8Z1JaU7+RrgW/JaOt5fR0NDsUFYNyUB7Sb8lT1k5f8xerrP4mRSuhlipbOVExDxjUrTrY2wiUDZBvfoDJokUdE0ULpT6IWhZ7SgEZhXkhYfBQJXAEUdbsTzSHB2eX7IijGnjoWdjiW02qB7RGuK2FK/NISZ4m+HzjwnK8EsV5iDvcKWoJ1/hiHdvcZkjK/juXm3sGRrDvGDzjcCm1C0TEKrfacIaAG3FH77WS2EPU68Wl6bGm6YG4Z8IU2ffa3IJUw6my2IUi7MzCLZQSle9m1zp22VInEh/t5EVFAU+a7MGljC/fEqW4j/vQ5sdaTaCRUMZVrZPOA99gRuznVWi1DFDpRBwj4jCW7UIQ1m1Vf1zcJdMeIXshrwMfz0j+JGzYol/e+FEBIleLI68k9kwsE',
        search_name:name,
        // search_phone:'',
        // search_division:'*',
        // search_campus:'*',
        // search_scope:'Staff-Fac',
        // search_full:'',
        search_btn:'Search',
        area_info$area_results$chkShowPicture:'on',
        // area_info$area_results$chkShowUsername:'on',
        // area_info$area_results$chkShowPersonType:'on',
        // area_info$area_results$chkShowDivision:'on',
        // area_info$area_results$chkShowCampus:'on'
    };

    request.post({
        url: baseUrl + 'Default.aspx',
        form: out
        // form: {
        //     search_name: 'hill'
        // },
        // body: '__EVENTTARGET=&__EVENTARGUMENT=&area_info_ClientState=%7B%22ActiveTabIndex%22%3A0%2C%22TabState%22%3A%5Btrue%2Ctrue%2Ctrue%2Ctrue%2Ctrue%5D%7D&department_tree_ExpandState=ecc&department_tree_SelectedNode=department_treet0&department_tree_PopulateLog=&__VIEWSTATE=tlIVmnpDWL2OaEyyXfBZ7%2BbJpZjTkEtXlzFTajBLKQ8gZHyEwBkj0yl4dysy9bHbViifW70DNDxp4CdHr96s%2BBfI1GVQ%2FyJCOnpJKB6J7qoK%2BamSrILfv8t%2BLz34mmUjl2AOgjaTxXB0Ps8INQbl3iLfXUXlt946xyB05HgPDOXCa%2BQzojVbCWl2k2lM0FTs7N8JuDslEIkii7GUPwOSyOtbluk11tmvmL03SiBOdi9TigHvH%2FrOep%2Bg%2Bjn6oEDYYFG1Ys5BSiZgyfvJ%2BQwVEImM5HuCMm%2FveZa3MmYauoNbGrcEyLDOZqcQ%2BQbaiuTxu2jPHTMFAoqUR6hqHXvinIO6GGy1o87o0HKWbGmrR6YARgwFVYvICtNbgbJLeQ86%2Fd7ttpRW%2BShAjoljfRORQhVDLnLl%2B9x8hjnWBKBTt1NG2KiaUdo0lAmbpSS5QNf8gMAQzhWr6mfFCsPO3iIkax8ndJxwVl9XUmA%2FV7QvDZTl3LfGT4aYBSFw%2BjyP7oESr6yVDoqpKCrdtyaTqznNvgua%2BY6eR%2BPLIg6BK7AIEQBjPz9oTKg0pad1NUPcL2voCixzA1y3j5zkHqe9AkMVl4vBTcScd4bt7bpt4EoTCH8ldfm8UJsckHjmLJ2lFjvinWdv4OwMnp94qN%2FnOiKzGEUAq9r4m9xk9LA7ugk0K7%2F0KM2qXacFayz2N7%2Fibbk5JFnBwoaXSSMe1ttENNYaVEXq7TJ86eAc7a9174Pd8ysYFcv4hQ2GdX3zdGL2YRx23dmAZNih8USoqIgYk2XNE28cKLoc7Ibml4lndhSbk7bc2j%2BmL6DoZhxu5iQxoS4SIhG8XjuU96C92NjaqdusxeCnxyU18C%2Fc5wQBY8QzWUryBoLgDEGiCTs%2FtuVLLmyhFFwT3pG8jM78l6hqGZAJOqxGHK8%2BTf15hEmot8eTJ0rEQi6yq8k6juwyd9U3jv1MAp1DExCAFytd9lKdnNBr9FvoMBvTTs2SMZh9t7RDhoLTzxi5FLSsnT0m5MVzMMXAzVSHfdT851MtcJm1XLyIESGWiYE%2FeEtZPXZgm2f3Sfo3E%2Bwie%2Br4LNahCIJDO6jsRQi1wf1I3nn%2BTtBIlkHyVfhH20NM6bFXCWuZJHf8QkNatN5GrU4drM4HAykb7H8l7sOXZw%3D%3D&__VIEWSTATEENCRYPTED=&__EVENTVALIDATION=Xl0UCTUHSlHK5iIRSga4kWvw9quLh1NEYpF4EBZF4Q%2Fl8byXKZoMPIJx0teY%2BeHLiqYzq933kGuraHjquP24qbnYIu8Z1JaU7%2BRrgW%2FJaOt5fR0NDsUFYNyUB7Sb8lT1k5f8xerrP4mRSuhlipbOVExDxjUrTrY2wiUDZBvfoDJokUdE0ULpT6IWhZ7SgEZhXkhYfBQJXAEUdbsTzSHB2eX7IijGnjoWdjiW02qB7RGuK2FK%2FNISZ4m%2BHzjwnK8EsV5iDvcKWoJ1%2FhiHdvcZkjK%2FjuXm3sGRrDvGDzjcCm1C0TEKrfacIaAG3FH77WS2EPU68Wl6bGm6YG4Z8IU2ffa3IJUw6my2IUi7MzCLZQSle9m1zp22VInEh%2Ft5EVFAU%2Ba7MGljC%2FfEqW4j%2FvQ5sdaTaCRUMZVrZPOA99gRuznVWi1DFDpRBwj4jCW7UIQ1m1Vf1zcJdMeIXshrwMfz0j%2BJGzYol%2Fe%2BFEBIleLI68k9kwsE&search_name=hill&search_phone=&search_division=*&search_campus=*&search_scope=Staff-Fac&search_full=&search_btn=Search&area_info%24area_results%24chkShowPicture=on&area_info%24area_results%24chkShowUsername=on&area_info%24area_results%24chkShowPersonType=on&area_info%24area_results%24chkShowDivision=on&area_info%24area_results%24chkShowCampus=on',
        // body: require('querystring').stringify(out),
        // headers: {
            // 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        // }
    }, function (error, response, body) {
        $ = cheerio.load(body);
        var src = $('#area_info_area_results table img').first().attr('src');

        src = baseUrl + src;
        callback(src);
    });
}

app.get('/professor/image', function (req, res) {
    getProfessorPicture(req.query.name, function (src) {
        res.send('<img src="' + src + '" />');
    });
});


app.listen(4000);
console.log('Listening');

function parsePage(html) {
    var $ = cheerio.load(html);

    var professorDropdown = $('select[name="professor"]');

    var professors = _.map(professorDropdown.children(), function (el, index) {
        var name;

        el = $(el);

        name = el.text().split(',');

        return {
            firstName: name[1],
            lastName: name[0],
            slug: el.val()
        };
    });

    return professors;
}