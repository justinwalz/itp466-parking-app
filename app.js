// http - http://nodejs.org/api/http.html
var http = require('http');
// express.js - http://expressjs.com
var express = require('express');
// path - http://nodejs.org/api/path.html
var path = require('path');
// request - allow us to hit other REST api's 
var request = require('request');
var async = require('async');

var routes = require("./routes");

// mongo 
var mongo   = require('mongoskin');
var DB = 'localhost:27017/parqdb'
var COLL = 'spaces'

// create our app using express
var app = express();

spacesColl = mongo.db(DB, { safe: true }).collection(COLL)

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'super-duper-secret-secret' }));
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

app.get('/', routes.index);

app.get('/spots', function(req, res) {
  spacesColl.find({}).toArray(function(err, items) {
    if(err) {
      return res.send(err);
    }
    var spots = {
      "spots": items
    }
    res.json(spots);
  });
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

  var nextId = spacesColl.find().count(function(err,count){
      nextId = count + 1; 
  });
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
          "endTime" : endTime,
          "reserved" : false
        };
        // add to spaces collection
        spacesColl.insert(newItem, {}, function() {
          res.send("Inserted space!"); 
        });


        // assuming always confirmed
        var response = {
          "status": "confirmed"
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

app.post('/reserve', function(req, res) {

  body = req.body;

  //has to be casted into an int...damnit
  var id = parseInt(body.id,10);

  if (!id) {
    errorResponse("Invalid /reserve: No id", res);
  }

  spacesColl.update({UUID : id }, {$set:{reserved: true }}, function(err) {
    if (err){ 
      console.log("error updating"); 
      // if not good to go
      var response = {
        "status": "error"
      };
      res.json(response);
    }
    else { 
      console.log("reserving " + id +"...");
      // if good to go
      var response = {
        "status": "confirmed"
      };
      res.json(response);
    }
  });

  

  
  
  

});

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
