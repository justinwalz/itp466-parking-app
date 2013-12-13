// packages we use...

// http - http://nodejs.org/api/http.html
var http = require('http');
// express.js - http://expressjs.com
var express = require('express');
// path - http://nodejs.org/api/path.html
var path = require('path');
// Google Maps - to geocode our addresses
var gm = require('googlemaps');
// create our app using express
var app = express();

/* This is default data before a real database is built */
var steve = {
  "name" : "Steve Jobs",
  "address" : "707 W. 28th Street, Los Angeles CA 90007",
  "latlng" : [ 34.0272891, -118.2796585],
  "price" : 10,
  "startTime" : "12",
  "endTime" : "16"
};

var cindy = {
  "name" : "Cindy Smith",
  "address" : "667 W. 28th Street, Los Angeles CA 90007",
  "latlng" : [ 34.0272142, -118.2792991],
  "price" : 15,
  "startTime" : "9",
  "endTime" : "10"
};

var joe = {
  "name" : "Joe Shmoe",
  "address" : "653 W. 28th Street, Los Angeles CA 90007",
  "latlng" : [ 34.027166, -118.278965],
  "price" : 8,
  "startTime" : "18",
  "endTime" : "21"
};

var database = {
	"spots": [
		steve, 
		cindy,
		joe
	]
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
app.use(express.static(path.join(__dirname, 'static'))); 

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get("/") is returned by static join above

// get the sample database
app.get('/sample.json', function(req, res) {
	// send back default data
	res.json(database);
});

// add to the sample database
app.post('/add', function(req, res) {

  // get the body of the request
	body = req.body;

  // get all fields
	var name = body.name,
		  address = body.address,
		  price = body.price,
		  startTime = body.startTime,
		  endTime = body.endTime;




  if (!name || !address || !price || !startTime || !endTime) {
    console.log("invalid post request");
    var response = {
      "status": "fail. incomplete fields"
    }
    res.json(response);
  } else {
    
  	// print
  	console.log(name + ", " + address + ". "); 
    console.log(price + " from " + startTime + " to " + endTime);

    var newItem = {
      "name" : name,
      "address" : address,
      "latlng" : [ 0, 0],
      "price" : price,
      "startTime" : startTime,
      "endTime" : endTime
    };
    database.spots.unshift(newItem);

    // assuming always ok
    var response = {
      "status": "ok"
    };
    res.json(response);
  }
});


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Parking app server listening on port ' + app.get('port'));
});
