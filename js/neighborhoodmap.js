// Set up an array of places that I visit.  This could be any number of items.
var initialPlaces = [
	{
		name: 'Manee Thai',
		type: 'Thai Cuisine',
		url: 'http://maneethaistl.com',
		lat: 38.594754,
		lng: -90.519612
	},
	{
		name: 'Joey B\'s Food and Drink',
		type: 'American Cuisine & Seafood',
		url: 'http://joeybsmanchester.com',
		lat: 38.593922, 
		lng: -90.519430
	},
	{
		name: 'Sushi AI',
		type: 'Japanese & Sushi',
		url: 'http://sushiaimenu.com',
		lat: 38.595066, 
		lng: -90.519720
	},
	{
		name: 'Shahrazad Mediterranean Restaurant',
		type: 'Middle Eastern Cuisine',
		url: 'http://shahrazadmanchester.com',
		lat: 38.595669, 
		lng: -90.522091
	},
	{
		name: 'Culvers',
		type: 'American Fast Food',
		url: 'http://culvers.com',
		lat: 38.592877,  
		lng: -90.519349
	}

];

//Build the knockout object
var Place = function(data) {
	this.name = ko.observable(data.name);
	this.type = ko.observable(data.type);
	this.url = ko.observable(data.url);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
}

// The ViewModel function
var ViewModel = function() {
	var self = this;

	this.placeList = ko.observableArray([]);

	initialPlaces.forEach(function(placeItem){
			self.placeList.push(new Place(placeItem));
	});

	function FilterControl(controlDiv, map) {
		// Set CSS for the control border.
		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '3px';
		controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
		controlUI.style.cursor = 'pointer';
		controlUI.style.marginBottom = '22px';
		controlUI.style.textAlign = 'center';
		controlUI.title = 'Click to Open the Map Filter';
		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior.
		var controlText = document.createElement('div');
		controlText.style.color = 'rgb(25,25,25)';
		controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
		controlText.style.fontSize = '16px';
		controlText.style.lineHeight = '38px';
		controlText.style.paddingLeft = '5px';
		controlText.style.paddingRight = '5px';
		controlText.innerHTML = 'Filter Markers';
		controlUI.appendChild(controlText);

		// Setup the click event listeners: Open (or close) the modal filter window
		controlUI.addEventListener('click', function() {
		  $('#filterModal').modal('toggle');
		});
	  }


	// Create a new blank array for all the listing markers.
	var markers = [];
	var currentMark;

	function buildInfoWindow(infowindow,map,marker) {
		console.log('hello');
		infowindow.open(map,marker);
		infowindow.setContent('<div>' + marker.title + ' - ' + marker.id + '</div><div id="pano"></div>');

	}
	// Function to build the map markers and infowWindows
	function buildMarkers(map) {
		var currentMark, countItems = 0;
		ko.utils.arrayForEach(self.placeList(), function(item) {
			var markerCoords = {lat: item.lat(), lng: item.lng()};
			
			// Default color for the marker
			var defaultIcon = makeMarkerIcon('0091ff');
			// Highlighted Marker
			var highlightedIcon = makeMarkerIcon('FFFF24');
			// Selected Marker
			var selectedIcon = makeMarkerIcon('FF0000');
			var marker = new google.maps.Marker({
				position: markerCoords,
				map: map,
				animation: google.maps.Animation.DROP,
				title: item.name(),
				icon: defaultIcon,
				id: countItems
			});
			//Push onto an array to track our markers so we can access them later easily
			markers.push(marker);
			var infowindow = new google.maps.InfoWindow({
			  content: item.name()
			});

			//call back for the infowindow
			//Code Source: https://stackoverflow.com/questions/6777721/google-maps-api-v3-infowindow-close-event-callback
			google.maps.event.addListener(infowindow,'closeclick',function(){
			   currentMark.setIcon(defaultIcon);
			});

			marker.addListener('click', function() {
				// var to keep a pointer to the 'this' scope
				var that = this;
				
				buildInfoWindow(infowindow,map,marker);

				//infowindow.open(map,marker);   
				// Animate the marker for 3 seconds
				this.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function(){ that.setAnimation(null) }, 3000);
				currentMark = that;
				that.setIcon(selectedIcon);
			});
			countItems++;
		});
		
	};

	/* Initialize map */
	var map;
	(function initMap() {
		// Constructor creates a new map - only center and zoom are required.
		map = new google.maps.Map(document.getElementById('map'), {
		  center: {lat: 38.594754, lng: -90.519612},
		  zoom: 17
		});

		 // Create the DIV to hold the control and call the FilterControl()
		// constructor passing in this DIV.
		var filterControlDiv = document.createElement('div');
		var filterControl = new FilterControl(filterControlDiv, map);
		filterControlDiv.index = 1;
		map.controls[google.maps.ControlPosition.TOP_CENTER].push(filterControlDiv);

		buildMarkers(map);

		google.maps.Map.prototype.clearMarkers = function() {
		for(var i=0; i < this.markers.length; i++){
				this.markers[i].setMap(null);
			}
			this.markers = new Array();
		};
	})();

	// Code Source: Udacity API Course
	// This function will loop through the listings and hide them all.
	function hideMarkers(markers) {
		for (var i = 0; i < markers.length; i++) {
		  markers[i].setMap(null);
		}
	};

	// Code Source: Udacity API Course
	// This function takes in a COLOR, and then creates a new marker
	// icon of that color. The icon will be 21 px wide by 34 high, have an origin
	// of 0, 0 and be anchored at 10, 34).
	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
			'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21,34));
		return markerImage;
	};

	// Code Source:  Google API Course
	// This is the PLACE DETAILS search - it's the most detailed so it's only
	// executed when a marker is selected, indicating the user wants more
	// details about that place.
	function getPlacesDetails(marker, infowindow) {
	  var service = new google.maps.places.PlacesService(map);
	  service.getDetails({
		placeId: marker.id
	  }, function(place, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
		  // Set the marker property on this infowindow so it isn't created again.
		  infowindow.marker = marker;
		  var innerHTML = '<div>';
		  if (place.name) {
			innerHTML += '<strong>' + place.name + '</strong>';
		  }
		  if (place.formatted_address) {
			innerHTML += '<br>' + place.formatted_address;
		  }
		  if (place.formatted_phone_number) {
			innerHTML += '<br>' + place.formatted_phone_number;
		  }
		  if (place.opening_hours) {
			innerHTML += '<br><br><strong>Hours:</strong><br>' +
				place.opening_hours.weekday_text[0] + '<br>' +
				place.opening_hours.weekday_text[1] + '<br>' +
				place.opening_hours.weekday_text[2] + '<br>' +
				place.opening_hours.weekday_text[3] + '<br>' +
				place.opening_hours.weekday_text[4] + '<br>' +
				place.opening_hours.weekday_text[5] + '<br>' +
				place.opening_hours.weekday_text[6];
		  }
		  if (place.photos) {
			innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
				{maxHeight: 100, maxWidth: 200}) + '">';
		  }
		  innerHTML += '</div>';
		  infowindow.setContent(innerHTML);
		  infowindow.open(map, marker);
		  // Make sure the marker property is cleared if the infowindow is closed.
		  infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		  });
		} else {
			alert('Get Place Failed...')
		}
	  });
	}



};

//Apply the Knockout bindings
ko.applyBindings(new ViewModel());