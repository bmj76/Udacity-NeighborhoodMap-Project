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


	var findCenter = function(placeList){

	}


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


	var map;

	/* Initialize map */
    (function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 38.594754, lng: -90.519612},
          zoom: 18
        });

         // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var filterControlDiv = document.createElement('div');
        var filterControl = new FilterControl(filterControlDiv, map);

        filterControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(filterControlDiv);
        var markerCoords = {lat: 38.594754, lng: -90.519612};
        var marker = new google.maps.Marker({
          position: markerCoords,
          map: map,
          title: 'First Marker!'
        });
        var infowindow = new google.maps.InfoWindow({
          content: 'Test InfoWindow'
        });
        marker.addListener('click', function() {
          infowindow.open(map,marker);
        });
    })();

};

//Apply the Knockout bindings
ko.applyBindings(new ViewModel());