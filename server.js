var express = require('express'),app = express();
errorHandler = function(err,req,res,next){res.redirect('/');};
app.set('port',(process.env.PORT || 80));
app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname));
app.get('/:page',function(req,res){res.sendFile(req.params.page + '.html',{'root':'./html'});}).use(errorHandler);
app.listen(app.get('port'),function(){console.log("Node app is running at localhost:" + app.get('port'));});