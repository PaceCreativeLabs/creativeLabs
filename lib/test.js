var request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash'),
    express = require('express');

request('http://whitepages.pace.edu/Default.aspx', function (error, res, body) {
    var $ = cheerio.load(body);

    var out = {};

    var inputs = _.map($('form *[name]'), function (el) {
        el = $(el);
        out[el.attr('name')] = el.val();
        console.log(el.attr('name') + ': '+ el.val());
    });

    //console.log(JSON.stringify(out, null, '\t'));
    // console.log(out);
});