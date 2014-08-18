var express = require('express'),
	scrape = require('./scrape'),
	path = require('path'),
	app = express();

app.use(express.static('../../html'));

app.engine('html', require('ejs').renderFile);

app.get('/home', function (req,res) {
	res.sendfile('html/index.html',{'root': '../'});
});

app.listen(5000);
console.log('Listening SCL');