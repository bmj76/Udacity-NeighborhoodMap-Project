# Udacity-NeighborhoodMap-Project

This is a single page application that shows places that I have defined in Manchester, Missouri where I was raised.  I still visit this part of town frequently, especially for a few restaurants that my family enjoys.

The application shows a Google map with markers of these places.  Clicking the markers will launch an infowindow, make a call to Foursquare's API and bring back the phone number, average rating, url, current operating status, etc.  The foursquare API call is actually 2 parts.. the first is to retrieve the Venue ID based on the name provided along with a location, and the 2nd is to get the venue details.

## Getting Started

Download or clone this repository to any folder on your system.  Start the Apache simple server web server.  Launch index.html.  If the dependencies are not loaded, please see the Bower.json file for more information.

## Map Markers

The Map Markers are 5 restaurants that I have visited in the past.  These are defined in neighborhoodmap.js.  So long as the model doesnt change structure this application should work with any number of locations.  If you want to change it you will also have to location the starting position of the map and zoom level to find an appropriate center location for your locations.

Markers have a custom style applied (Blue).  When they are clicked, the Marker turns Red and animates (Bounces) for a few seconds and then stops.

Clicking the Map Markers open an InfoWindow and will initiate an API call to Foursquare to retrieve additional data about the locations.

## Filtering

A Filter control is at the Top Center of the Google Map.  Clicking the control will open a Modal window that should size itself appropriately to the screen size.

To filter the location, start typing in the input box.  Any location name that does not match the filter text will be hidden.  This is a simple "substring" search.

## Developer Information

Bower was used to manage project dependencies.  Please review the bower.json file for more information.

The bootstrap library is used to ensure responsive design.  A bootstrap modal window is used to create an overlay when the Filter Markers button is pushed.

jQuery is required by bootstrap.

Knockout JS is used for MV-VM code organization as well as declartive bindings and automatic UI refresh

This project uses the Google Maps API to generate the Map, Markers, InfoWindows and custom control button

The Foursquare API is used to retrieve crowd sourced data about the selected Map points.
