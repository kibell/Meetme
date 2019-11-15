console.log("lol")
const GeoLocationURL = "https://maps.googleapis.com/maps/api/geocode/json?address=77064&key=AIzaSyCM2ChWHyTWpo5OJQFdiI-4tLDFUugVc7Q"
let map; 
let service;
let startLat = 0;
let startLng = 0;
let endLat = 0;
let endLng = 0;
let midLat = 0; 
let midLng = 0;
let input = 0;
let distance;

$("#info-modal").modal('show');

function initMap() {
  let directionsRenderer = new google.maps.DirectionsRenderer;
  let directionsService = new google.maps.DirectionsService;
  let geocoder = new google.maps.Geocoder();
  let infowindow = new google.maps.InfoWindow;
  let start = document.getElementById('start').value;
  let end = document.getElementById('end').value;


//Rendering map on page
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {
      lat: 41.85,
      lng: -87.65
    }
  });
  directionsRenderer.setMap(map);
  // directionsRenderer.setPanel(document.getElementById('right-panel'));

  let control = document.getElementById('floating-panel');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  
  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    let start = document.getElementById('start').value;
    let end = document.getElementById('end').value;
    

    directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    }, function (response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        console.log("directions response" + response)
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }




  $(document).ready(function () {
    

    //add a function that gets triggered on click of "Go" button, to get directions between start and end 
    document.getElementById('get-directions').addEventListener('click', function () {

      calculateAndDisplayRoute(directionsService, directionsRenderer);
      geocodeAddress(geocoder, map);

      function geocodeAddress(geocoder, resultsMap) {
       // let address = document.getElementById('inputTest').value;
       let start = document.getElementById('start').value;
       let end = document.getElementById('end').value;

       //get lat long for start address 
       console.log("Start in function" + start);
        geocoder.geocode({
          'address': start
        }, function (results, status){
            if(status === 'OK'){
              startLat = results[0].geometry.location.lat();
              midLat += startLat;
              startLng = results[0].geometry.location.lng();
              console.log("lat " + startLat + "Long: "+ startLng); 
            }else{
              alert('Geocode was not successful for the following reason: ' + status);
            }
        }
        );

        //get lat long for end address
        console.log("End in function" + end);
        geocoder.geocode({
          'address': end
        }, function (results, status){
            if(status === 'OK'){
              endLat = results[0].geometry.location.lat();
              midLat += endLat;
              endLng = results[0].geometry.location.lng();
              console.log("lat " + endLat + "Long: "+ endLng); 
            }else{
              alert('Geocode was not successful for the following reason: ' + status);
            }
        }
        );

//function from stackoverflow to calculate middle point
//-- Define radius function
if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function () {
      return this * Math.PI / 180;
  }
}

//-- Define degrees function
if (typeof (Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function () {
      return this * (180 / Math.PI);
  }
}

//-- Define middle point function
function middlePoint(lat1, lng1, lat2, lng2) {

  //-- Longitude difference
  let dLng = (lng2 - lng1).toRad();

  //-- Convert to radians
  lat1 = lat1.toRad();
  lat2 = lat2.toRad();
  lng1 = lng1.toRad();

  let bX = Math.cos(lat2) * Math.cos(dLng);
  let bY = Math.cos(lat2) * Math.sin(dLng);
  let lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
  let lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

  //-- Return result
  return [lng3.toDeg(), lat3.toDeg()];
}

//-- Example
let midPoint = middlePoint(startLat, startLng, endLat, endLng);
midLng  = midPoint[0];
midLat = midPoint[1];

mystartLatLng = new google.maps.LatLng({lat: startLat, lng: startLng});
myendLatLng = new google.maps.LatLng({lat: endLat, lng: endLng});
distance = google.maps.geometry.spherical.computeDistanceBetween(mystartLatLng, myendLatLng) * .2;
console.log("distance" + distance);
console.log("midLat: "+ midLat);
console.log("midLng: " + midLng);
input = midLat + ","+midLng;
        //add code to reverse geocode and pin address for midpoint lat long 
        let latlngStr = input.split(',', 2);
        let latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              map.setZoom(11);
              let marker = new google.maps.Marker({
                position: latlng,
                map: map
              });
             // infowindow.setContent(results[0].formatted_address);
              //infowindow.open(map, marker);

              // Add circle overlay and bind to marker
              var circle = new google.maps.Circle({
                map: map,
                radius: distance,    // 10 miles in metres
                fillColor: '#AA0000'
              });
              circle.bindTo('center', marker, 'position');
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
        
    




      }

      function geocodeLatLng(midLat, midLng, geocoder, map, infowindow) {

        let input = midLat + ',' + midLng;
        let latlngStr = input.split(',', 2);
        let latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              map.setZoom(11);
              let marker = new google.maps.Marker({
                position: latlng,
                map: map
              });
              infowindow.setContent(results[0].formatted_address);
              infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }

      //get restaurants from places api
      console.log("request Midpoint  " + midLat + midLng)
 let center = new google.maps.LatLng(midLat, midLng);     
 let category = $("#category").val();
 console.log(category);
 console.log("Distance in places API call" + distance);
 var request = {
  location: center,
  radius: distance,
  types:['restaurant', "food"]
};
var service = new google.maps.places.PlacesService(map);


service.nearbySearch(request, callback);
console.log(request)
// console.log

function callback(results, status) {
  console.log(results)

  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log("Nearby search : " + results) ;
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    let newP = $('<p>')
    newP.text(results[i].name)

    $('#right-panel').append(newP);

    
    
    }
  
  
  }
  

  
}


  // service.findPlaceFromQuery(request, function(results, status) {
    
  //     map.setCenter(results[0].geometry.location);
  //   }
  // });

  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }

    });


  });

  function calculateAndDisplayMidpoint() {
    //let start = document.getElementById('start').value;
    //let end = document.getElementById('end').value;
    console.log("calculating midpoint");
    console.log("Start address: " + start);
    startLat = getAddressLat(start, geocoder);
    console.log("Start Lat" + startLat);


  }

  function getAddressLat(address, geocoder) {
    geocoder.geocode({
      'address': address
    }, function (results, status) {
      console.log(results);
      if (status === 'OK') {
        return results[0].geometry.location.lat();

      } else {
        return 0;
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });


  }

 
}


// sign in auth ------------ //












// Chat-------------------------







// $( document).ready(function(){