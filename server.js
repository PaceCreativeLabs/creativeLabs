var express = require('express')
var app = express();
var fs = require('fs');



app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/html'))
app.use(express.static(__dirname))



app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/home', function (req,res) {
   	res.sendfile('index.html',{'root': './html'});
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

app.get('/contact', function (req,res) {
   	res.sendfile('contact.html',{'root': './html'});
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
