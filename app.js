console.log("im working")
const GeoLocationURL = "https://maps.googleapis.com/maps/api/geocode/json?address=77064&key=AIzaSyCM2ChWHyTWpo5OJQFdiI-4tLDFUugVc7Q"
let map;
//define start and end coordinates globally
let startLat = 0;
let startLng = 0;
let endLat = 0;
let endLng = 0;
let midLat = 0; 
let midLng = 0;
let input = 0;


function initMap() {
  let directionsRenderer = new google.maps.DirectionsRenderer;

  let directionsService = new google.maps.DirectionsService;
  let geocoder = new google.maps.Geocoder();
  let infowindow = new google.maps.InfoWindow;
  let start = document.getElementById('start').value;
  let end = document.getElementById('end').value;



  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {
      lat: 41.85,
      lng: -87.65
    }
  });
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById('right-panel'));

  let control = document.getElementById('floating-panel');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  /* let onChangeHandler = function() {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
      
    };
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
   */
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
        console.log(response)
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }




  $(document).ready(function () {
    
    document.getElementById('findLocation').addEventListener('click', function () {
    });

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

        //get lat long for mid point address
        

        /*
 * Find midpoint between two coordinates points
 * Source : http://www.movable-type.co.uk/scripts/latlong.html
 */

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
console.log("midLat: "+ midLat);
console.log("midLng: " + midLng);
input = midLat + ","+midLng;
//console.log(middlePoint(48.2320728, 4.1482735, 48.2320524, 4.1480716));
        /* midLat = (startLat + startLng)/2;
        midLng = (startLng + endLng)/2;
        console.log("midLat: "+ midLat);
        console.log("midLng: " + midLng);
        
        console.log("Input: "+ input); */

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
              infowindow.setContent(results[0].formatted_address);
              infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
        
       /*  geocoder.geocode({
          'location': latlng
        }, function (results, status) {
          console.log(results);
          if (status === 'OK') {
            console.log(results[0].geometry.location.lat());
            console.log(results[0].geometry.location.lng());
            let marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        }); */




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

  function getAddressLng() {

  }
}


// chat function //



// Create a letiable to reference the database



// $( document).ready(function(){