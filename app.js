var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var database = {
  "name" : "Steve Jobs",
  "address" : "707 W. 28th Street, Los Angeles",
  "price" : 10,
  "startTime" : "12",
  "endTime" : "16"
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
	// send back default data
	res.json(database);
});

app.post('/add', function(req, res) {
	body = req.body;
  	console.log("/add - " + body);


  	var name = body.name,
  		address = body.address,
  		price = body.price,
  		startTime = body.startTime,
  		endTime = body.endTime;

  	// put data into mongo

  	// assuming always ok
  	var response = {
  		"status": "ok"
  	};
  	res.json(response);
});


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Parking app server listening on port ' + app.get('port'));
});
