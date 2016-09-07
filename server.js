var express = require('express');
var app = express();
var routes = require('server/routes');
var bodyParser = require('body-parser');
var path = require('path');
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

routes(app);

app.all('/*',function (req, res){
	res.sendFile(path.join(__dirname + '/src/server/views/layouts/index.html'));
});

app.listen(PORT, function(){
	console.log('Server running on '+PORT);
});