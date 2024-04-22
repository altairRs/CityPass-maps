let map;
let directionsService;
let directionsRenderer;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 51.1694, lng: 71.4491 },
		zoom: 13,
		mapId: '867ef8ed097842b3',
		mapTypeControl: false,
		fullscreenControl: false,
		streetViewControl: false,
	});

	directionsService = new google.maps.DirectionsService();
	directionsRenderer = new google.maps.DirectionsRenderer();
	directionsRenderer.setMap(map);

	function calculateAndDisplayRoute() {
		if (window.origin && window.destination) {
			const request = {
				origin: window.origin,
				destination: window.destination,
				travelMode: google.maps.TravelMode.DRIVING,
			};

			directionsService.route(request, (response, status) => {
				if (status === 'OK') {
					directionsRenderer.setDirections(response);
				} else {
					window.alert('Directions request failed due to ' + status);
				}
			});
		} else {
			window.alert('You must select both an origin and a destination.');
		}
	}


	const statusElement = document.getElementById('status');
	const resetBtn = document.getElementById('resetBtn');

	resetBtn.addEventListener('click', () => {
		window.origin = undefined;
		window.destination = undefined;
		statusElement.textContent = 'Select an origin by clicking a marker on the map.';
		directionsRenderer.setDirections({routes: []});
		showUserLocation(); // Reset to show user location again
	});

	showUserLocation(); // Call to display user's location

	const markers = [
		["Baiterek Tower", 51.1282, 71.4305, 'yoshi_house.svg', 38, 31],
		['Khan Shatyr', 51.1286, 71.4058, 'pointer.svg', 30, 47.8],
		['Nur Astana Mosque', 51.1269, 71.4073, 'ghosthouse.svg', 40, 48],
		['Ak Orda Presidential Palace', 51.1404, 71.4249, 'castle.svg', 40, 53],
		['Kazakhstan Central Concert Hall', 51.1281, 71.4163, 'star.svg', 38, 38],
		['Triumphant Arch "Mangilik El"', 51.1227, 71.4708, 'hill_with_eyes.svg', 50, 60.7],
	];

	markers.forEach((markerInfo) => {
		const marker = new google.maps.Marker({
			position: { lat: markerInfo[1], lng: markerInfo[2] },
			map: map,
			title: markerInfo[0],
			icon: {
				url: markerInfo[3],
				scaledSize: new google.maps.Size(markerInfo[4], markerInfo[5])
			},
			animation: google.maps.Animation.DROP
		});

		google.maps.event.addListener(marker, 'click', function () {
			if (!window.origin) {
				window.origin = { lat: marker.position.lat(), lng: marker.position.lng() };
				statusElement.textContent = 'Origin set to ' + marker.title + '. Select a destination.';
			} else if (!window.destination) {
				window.destination = { lat: marker.position.lat(), lng: marker.position.lng() };
				statusElement.textContent = 'Destination set to ' + marker.title + '. Click "Reset Selection" to start over or choose another destination.';
				calculateAndDisplayRoute();
			} else {
				window.origin = { lat: marker.position.lat(), lng: marker.position.lng() };
				window.destination = undefined;
				statusElement.textContent = 'Origin reset to ' + marker.title + '. Select a destination.';
			}
		});
	});
}

function showUserLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			const userLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			const userMarker = new google.maps.Marker({
				position: userLocation,
				map: map,
				title: 'Your Location',
				icon: {
					url: 'pointer.svg',
					scaledSize: new google.maps.Size(30, 47.8) // Adjust the size as needed
				},
				animation: google.maps.Animation.DROP
			});

			map.setCenter(userLocation); // Optionally center the map on user's location
		}, function() {
			handleLocationError(true, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, pos) {
	const infoWindow = new google.maps.InfoWindow({
		map: map,
		position: pos,
		content: browserHasGeolocation ?
			'Error: The Geolocation service failed.' :
			'Error: Your browser doesn\'t support geolocation.'
	});

	infoWindow.open(map);
}
