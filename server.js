var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 80));
app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname));

app.get('/home', function (req,res) {
	res.redirect('/');
});

app.get('/team', function (req,res) {
	res.status(200).send('aboutandteam.html',{'root':'./html'});
});

app.get('/skills', function (req,res) {
	res.status(200).send('services.html');
});

app.get('/projects', function (req,res) {
	res.status(200).send('projects.html');
});

app.get('/join', function (req,res) {
	res.status(200).send('join.html');
});

app.get('/contact', function (req,res) {
	res.status(200).send('contact.html');
});

app.get('/project', function (req,res) {
	res.status(200).send('singleproject.html');
});

app.get('*', function(req, res){
  res.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});