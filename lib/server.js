var express = require('express')
var app = express();
var fs = require('fs');



app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/html'))
app.use(express.static(__dirname))
app.use(express.static(__dirname + '../html'))



app.get('/', function(request, response) {
  response.send('Hello World!')
  console.log( __dirname + "../html" );
console.log("heyy");

})

app.get('/home', function (req,res) {
	
if (fs.existsSync("http://cryptic-peak-6995.herokuapp.com/html/index.html")) {
   	res.sendfile('index.html',{'root': './html'});
} else {
	res.send("Nopity");
}
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
