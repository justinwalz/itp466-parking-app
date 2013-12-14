// http - http://nodejs.org/api/http.html
var http = require('http');
// express.js - http://expressjs.com
var express = require('express');
// path - http://nodejs.org/api/path.html
var path = require('path');
// request - allow us to hit other REST api's 
var request = require('request');
var async = require('async');

// mongo 
// var Mongoose = require('mongoose');
// var db = Mongoose.createConnection('localhost', 'parkingapp');
//var mongo   = require('mongoskin');
//var DB = 'localhost:3000/parqdb'
//var COLL = 'spaces'

//spacesColl = mongo.db(DB, { safe: true }).collection(COLL)

// create our app using express
var app = express();

/* This is default data before a real database is built */
var steve = {
  "UUID" : "1",
  "name" : "Steve Jobs",
  "address" : "707 W. 28th Street, Los Angeles CA 90007",
  "latlng" : [ 34.0272891, -118.2796585],
  "price" : 10,
  "startTime" : "12",
  "endTime" : "16"
};

var cindy = {
  "UUID" : "2",
  "name" : "Cindy Smith",
  "address" : "667 W. 28th Street, Los Angeles CA 90007",
  "latlng" : [ 34.0272142, -118.2792991],
  "price" : 15,
  "startTime" : "9",
  "endTime" : "10"
};

var joe = {
  "UUID" : "3",
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

var trueDatabase = {
  "spots": []
}

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

//TODO : grab all entries from DB and return database

// get the sample database
app.get('/sample.json', function(req, res) {
	// send back default data
  if (trueDatabase.spots.length > 0) {
    res.json(trueDatabase);
  } else {
    res.json(database);    
  }
});

// add to the database
app.post('/add', function(req, res) {

  // get the body of the request
	body = req.body;

  // get all fields
	var name = body.name,
		  address = body.address,
		  price = body.price,
		  startTime = body.startTime,
		  endTime = body.endTime;

  if (!name) {
    errorResponse("Invalid /add: No Name", res);
  }
  if (!address) {
    errorResponse("Invalid /add: No Address", res);
  }
  if (!price) {
    errorResponse("Invalid /add: No Price", res);
  }
  if (!startTime) {
    errorResponse("Invalid /add: No Start Time", res);
  }
  if (!endTime) {
    errorResponse("Invalid /add: No End Time", res);
  }

  // all good, geocode

  // debug output
  console.log(name + ", " + address + ". "); 
  console.log(price + " from " + startTime + " to " + endTime);

  // build fields
  var nextId = database.spots.length + 1;
  // geocodable address
  var geoAddress = address.split(' ').join('+');

  var domain = 'http://maps.googleapis.com/maps/api/geocode/json?';
  var options = 'address=' + geoAddress + '&sensor=false';

  console.log("hitting " + domain + options);

  request(domain + options, function (error, response, body) {
    
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      if (json.status === "OK") {
        location = json.results[0].geometry.location;
        formattedAddress = json.results[0].formatted_address;

        // got our location, now enter into DB
        var newItem = {
          "UUID" : nextId,
          "name" : name,
          "address" : formattedAddress,
          "latlng" : [ location.lat, location.lng],
          "price" : price,
          "startTime" : startTime,
          "endTime" : endTime
        };
        //TODO add database call to push
        trueDatabase.spots.push(newItem);
        //parqColl.insert(newItem, {}, function() {
          //res.send("Inserted space!"); 
        //});


        // assuming always ok
        var response = {
          "status": "ok"
        };
        res.json(response);

      } else {
        errorResponse("Invalid /add: Address couldn't be geocoded", res);
      }
    } else {
      errorResponse("Invalid /add: Address couldn't be geocoded", res);
    }
  })  
}); // end app.post()

function errorResponse(error, res) {
  console.log(error);
  var response = {
    "status": error
  }
  res.json(response);
}

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Parking app server listening on port ' + app.get('port'));
});
