import { Template } from 'meteor/templating';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import './googlemap.html';


Template.googlemap.helpers({
  exampleMapOptions() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(-37.8136, 144.9631),
        zoom: 8,




      };
    }
  },
});

Template.googlemap.onCreated(function() {
  GoogleMaps.ready('exampleMap', function(map) {
    console.log("I'm ready!");

  });
});


Template.googlemap.onRendered(function() {

  

  var drawingManager = new google.maps.drawing.DrawingManager();
      drawingManager.setMap(GoogleMaps);

});
