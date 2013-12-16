/**
 * Simple Angular.js app to get started learning and working with the framework.
 */

// Define controller
function ParkingCtrl($scope, $http) {
  // render from DB
  render($scope, $http);

  // function called when submit button pressed to add location
  $scope.addLocation = function() {
    // get all elements
    var name = document.getElementById("name").value,
        address = document.getElementById("address").value,
        price = document.getElementById("price").value,
        startTime = document.getElementById("startTime").value,
        endTime = document.getElementById("endTime").value;

    // debug statement
    console.log(name + address + price + startTime + endTime);

    // TODO: client side validation

    // TODO: geocode the new latlng

    var payload = {
      "name" : name,
      "address" : address,
      "price" : price,
      "startTime" : startTime,
      "endTime" : endTime
    };

    // Send post request to server to insert into DB
    $http.post('/add', payload).success(function() {
      console.log("Successful post");
      // render the db again
      render($scope, $http);
    });
  }

  // function called when submit button pressed to add location
  $scope.reserveSpot = function() {
    // get all elements
    var index = document.getElementById("index").value;

    console.log("reserving " + index);

    // TODO: client side validation

    // TODO: geocode the new latlng

    var payload = {
      "id" : index
    };

    // Send post request to server to insert into DB
    $http.post('/reserve', payload).success(function() {
      console.log("Successful post");
      // render the db again
      render($scope, $http);
    });
  }

}

function render($scope, $http) {
  $http.get('/spots').success(function(data) {
    $scope.sample = data;
    var html = "There are " + data.spots.length + " people in the database <br>";
    html += "<table border='1px;padding:5px'>";
    html += "<tr>";
    html += "<th>Name</th>";
    html += "<th>Address</th>";
    html += "<th>Price</th>";
    html += "<th>Start Time</th>";
    html += "<th>End Time</th>";
    html += "<th>Reserved?</th>"
    html += "</tr>";
    for (var i=0; i<data.spots.length; i++) {
      //html += "<strong>Person " + i + "</strong><br>"
      html += "<tr>";
      html += "<td>" + data.spots[i].name + "</td>";
      html += "<td>" + data.spots[i].address + "</td>";
      html += "<td>" + data.spots[i].price + "</td>";
      html += "<td>" + data.spots[i].startTime + "</td>";
      html += "<td>" + data.spots[i].endTime + "</td>";
      html += "<td>" + data.spots[i].reserved + "</td>";
      html += "</tr>";

    }
    html += "</table>"

    document.getElementById("db").innerHTML = html;
  });
}
/*
function render($scope, $http) {
  $http.get('/sample.json').success(function(data) {
    $scope.sample = data;
    var html = "There are " + data.data.spots.length + " people in the database <br>";
    html += "<table border='1px;padding:5px'>";
    html += "<tr>";
    html += "<th>Name</th>";
    html += "<th>Address</th>";
    html += "<th>Price</th>";
    html += "<th>Start Time</th>";
    html += "<th>End Time</th>";
    html += "</tr>";
    for (var i=0; i<data.data.spots.length; i++) {
      //html += "<strong>Person " + i + "</strong><br>"
      html += "<tr>";
      html += "<td>" + data.data.spots[i].name + "</td>";
      html += "<td>" + data.data.spots[i].address + "</td>";
      html += "<td>" + data.data.spots[i].price + "</td>";
      html += "<td>" + data.data.spots[i].startTime + "</td>";
      html += "<td>" + data.data.spots[i].endTime + "</td>";
      html += "</tr>";

    }
    html += "</table>"

    document.getElementById("db").innerHTML = html;
  });
}


*/

// Initiate angular app and bind controller to app
var parkingApp = angular.module('parkingApp', []);
parkingApp.controller('ParkingCtrl', ParkingCtrl);
