console.log ("im working")
const GeoLocationURL = "https://maps.googleapis.com/maps/api/geocode/json?address=77064&key=AIzaSyCM2ChWHyTWpo5OJQFdiI-4tLDFUugVc7Q"
let map;



function initMap() {
    let directionsRenderer = new google.maps.DirectionsRenderer;
    
    let directionsService = new google.maps.DirectionsService;
    let geocoder = new google.maps.Geocoder();
    
    
 
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
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
    }, function(response, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        console.log(response)
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }




$( document).ready(function(){
document.getElementById('findLocation').addEventListener('click', function(){
console.log("hey");
geocodeAddress(geocoder, map);
function geocodeAddress(geocoder, resultsMap) {
    // let address = document.getElementById('inputTest').value;
    let address = "Sydney, NSW";
    console.log(address);
    geocoder.geocode({'address': address}, function(results, status) {
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
            });
          



}

});

//add a function that gets triggered on click of "Go" button, to get directions between start and end 
document.getElementById('get-directions').addEventListener('click', function(){
  
  calculateAndDisplayRoute(directionsService, directionsRenderer);

});


});
}
 

// chat function //

 

// Create a variable to reference the database



// $( document).ready(function(){
