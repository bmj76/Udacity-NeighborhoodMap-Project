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
		name: 'Tucker\'s Place',
		type: 'Steakhouse',
		url: 'www.tuckersplacestl.com/',
		lat: 38.5919648, 
		lng: -90.5072234
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
	this.isVisible = ko.observable(true);
};

// The ViewModel function
var ViewModel = function() {
	var self = this;
	this.placeList = ko.observableArray([]);

	initialPlaces.forEach(function(placeItem){
			self.placeList.push(new Place(placeItem));
	});
	
	self.currentFilter = ko.observable(''); // property to store the filter

	// A computed column to track which items match the currentFilter
	self.filterPlaces = ko.computed(function() {
		return ko.utils.arrayFilter(self.placeList(), function(place) {
			//return place.name() == self.currentFilter();
			currentFilterValue = self.currentFilter();
			if (place.name().indexOf(currentFilterValue) > -1) {
				//console.log('setting ' + place.name() + ' to: true');
				place.isVisible(true);
				return true;
			} else {
				//console.log('setting ' + place.name() + ' to: false');
				place.isVisible(false);
				return false;
			}
		});
	});

	function FilterControl(controlDiv, map) {
		// Set CSS for the control border.
		var controlUI = document.createElement('div');
		controlUI.classList.add("filterControlBorder");
		controlUI.title = 'Click to Open the Map Filter';
		controlDiv.appendChild(controlUI);

		// Set CSS for the control interior.
		var controlText = document.createElement('div');
		controlUI.classList.add("filterControlButton");
		controlText.innerHTML = 'Filter Markers';
		controlUI.appendChild(controlText);

		// Setup the click event listeners: Open (or close) the modal filter window
		controlUI.addEventListener('click', function() {
		  $('#filterModal').modal('toggle');
		});
	  }

	function getFourSquareVenue(venue_id,client_id,client_secret,infowindow,mpa,marker) {
		var fourSquareVenueURL = 'https://api.foursquare.com/v2/venues/';

		var result = 'No Third Party Data found!';
		//Get Venue Details
		$.ajax( {
			url: fourSquareVenueURL + venue_id,
			type: 'GET',
			data: { 
				client_id: client_id,
				client_secret: client_secret,
				v: '20180105'
			},
			success: function( data ) {
				
				var venue = data.response.venue;
				// console.log(venue);
				var output = '<div class="container-fluid">';
				output += '<div>' + venue.name + '</div>';
				if (venue.contact.formattedPhone) {
					output += '<div>' + venue.contact.formattedPhone + '</div>';
				} else {
					output += '<div>No Phone Number Listed</div>';
				}
				if (venue.hours && venue.hours.status) {
					output += '<div>' + venue.hours.status + '</div>';
				} else {
					output += '<div>No Operating Hours listed</div>';
				}
				if (venue.rating) {
					output += '<div>Rating: ' + venue.rating + '</div>';
				} else {
					output += '<div>No Rating Available</div>';
				}
				if (venue.url) {
					output += '<div><a href="' + venue.url + '" target="_blank">' + venue.url + '</a></div>';
				} else {
					output += '<div>No URL Listed</div>';
				}
				output += '<div><img style="width:200px; height:33px" src="images/foursquare.png" alt="Foursquare logo image"></div>';
				output += '</div>';

				infowindow.open(map,marker);
				infowindow.setContent(output);
			},
			error: function(e) {
				alert('Error connecting to the Foursquare Venue API!');
				return result;
			}

		});
	}

	function getFourSquareData(infowindow,map,marker) {

		var client_id = 'LN2RBI5V4ESXGLQWXDER05TF2CJWZYDFXGSVW3HEGBF2KHJV';
		var client_secret = 'Z3YKGDKSTYG2XEACBMSRPQS4YCWNRQWPVUHAMYETHK1KLCHY';
		var fourSquareSearchURL = 'https://api.foursquare.com/v2/venues/search';
		
		//https://stackoverflow.com/questions/5290336/getting-lat-lng-from-google-marker
		var lat = marker.getPosition().lat();
		var lng = marker.getPosition().lng();

		var result = 'No Third Party Data found!';
		//First we need to search for the business to get the Foursquare Venue ID 
		$.ajax( {
			url: fourSquareSearchURL,
			type: 'GET',
			data: { 
				client_id: client_id,
				client_secret: client_secret,
				query: marker.title,
				ll: lat + ',' + lng,
				v: '20170801',
				limit: 1
			},
			success: function( data ) {
				result = data.response.venues;
				var venue_id = result[0].id;
				// Make a call to a 2nd function to get details once we know the venue id
				getFourSquareVenue(venue_id,client_id,client_secret,infowindow,map,marker);
			},
			error: function(e) {
				alert('Error connecting to the Foursquare Search API!');
				return result;
			}

		});
	}
	// Function to build the map markers and infowWindows
	function buildMarkers(map) {
		var currentMark, countItems = 0;
		ko.utils.arrayForEach(self.placeList(), function(item) {
			
			var markerCoords = {lat: item.lat(), lng: item.lng()};
			
			// Default color for the marker
			var defaultIcon = makeMarkerIcon('0091ff');
			// Highlighted Marker
			var selectedIcon = makeMarkerIcon('FF0000');
			var marker = new google.maps.Marker({
				position: markerCoords,
				map: map,
				animation: google.maps.Animation.DROP,
				title: item.name(),
				icon: defaultIcon,
				id: countItems
			});

			//Create the InfoWindow
			var infowindow = new google.maps.InfoWindow({
				content: item.name()
			});

			// Subscribe to the isVisible variable so that when it changes, so do the markers.  cool.
			console.log(item.name() + ': ' + item.isVisible());
			item.isVisible.subscribe(function(currentState) {
				//console.log(item.name() + ': ' + item.isVisible());
				marker.setVisible(currentState);
			});


			
			/*	call back for the infowindow
				Code Source: https://stackoverflow.com/questions/6777721/google-maps-api-v3-infowindow-close-event-callback */
			google.maps.event.addListener(infowindow,'closeclick',function(){
				currentMark.setIcon(defaultIcon);
			});

			marker.openMe = function(marker) {
				var that = this;
				
				getFourSquareData(infowindow,map,marker);

				//infowindow.open(map,marker);   
				// Animate the marker for 3 seconds
				this.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function() { 
					that.setAnimation(null);
				}, 3000);
				currentMark = that;
				that.setIcon(selectedIcon);
			};
			marker.addListener('click', function() {
				// var to keep a pointer to the 'this' scope
				this.openMe(this);
			});

			//Add the marker to each placeList item as a property per suggest of Udacity reviewer
			item.marker = marker;

			countItems++;
		});
	}

	/* Initialize map */
	var map;
	(function initMap() {
		// Constructor creates a new map - only center and zoom are required.
		map = new google.maps.Map(document.getElementById('map'), {
		  center: {lat: 38.594754, lng: -90.519612},
		  zoom: 15
		});

		/*	Create the DIV to hold the control and call the FilterControl()
			constructor passing in this DIV. */
		var filterControlDiv = document.createElement('div');
		var filterControl = new FilterControl(filterControlDiv, map);
		filterControlDiv.index = 1;
		map.controls[google.maps.ControlPosition.TOP_CENTER].push(filterControlDiv);

		//Build the Map Markers
		buildMarkers(map);
	})();

	/*	Code Source: Udacity API Course
		This function takes in a COLOR, and then creates a new marker
		icon of that color. The icon will be 21 px wide by 34 high, have an origin
		of 0, 0 and be anchored at 10, 34). */
	function makeMarkerIcon(markerColor) {
		var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
			'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21, 34));
		return markerImage;
	}

	self.selectListItem = function(place) {
		//self.placeList.remove(place);
		/* 	We want to loop over the placeList array and hide all
			the items except for the clicked item from the Filter
			Window */
		ko.utils.arrayForEach(self.placeList(), function(item) {
			if (item != place) {
				item.marker.setVisible(false);
			} else {
				$('#inputFilter').val(item.name());
				item.marker.setVisible(true);
				self.currentFilter(item.name());
				item.marker.openMe(item.marker);
			}

		});
    };
};

//Apply the Knockout bindings
function startPage() {
	ko.applyBindings(new ViewModel());
}