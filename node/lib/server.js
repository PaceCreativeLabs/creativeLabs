var express = require('express'),
	//scrape = require('./scrape'),
	path = require('path'),
	app = express();

app.use(express.static('../../html'));

app.engine('html', require('ejs').renderFile);

// simple logger
// app.use(function(req, res, next){
//   console.log('%s %s', req.method, req.url);
//   next();
// });

// // respond
// app.use(function(req, res, next){
//   res.send('Hello World');
// });

app.get('/home', function (req,res) {
	res.sendfile('index.html',{'root': '../html'});
});

app.listen(5000);
console.log('Listening SCL node');