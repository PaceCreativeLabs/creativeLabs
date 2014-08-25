var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname));

app.get('/home', function (req,res) {
   	res.redirect('/');
});

app.get('/team', function (req,res) {
   	res.sendfile('aboutandteam.html',{'root': './html'});
});

app.get('/skills', function (req,res) {
   	res.sendfile('services.html',{'root': './html'});
});

app.get('/projects', function (req,res) {
   	res.sendfile('projects.html',{'root': './html'});
});

app.get('/join', function (req,res) {
   	res.sendfile('join.html',{'root': './html'});
});

app.get('/contact', function (req,res) {
   	res.sendfile('contact.html',{'root': './html'});
});

app.get('*', function(req, res){
  res.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});