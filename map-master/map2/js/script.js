function initMap() {
				var customMapType = new google.maps.StyledMapType([{
						stylers: [{
								hue: '#1A9CE3'
						}, {
								saturation: 50
						}, {
								visibility: 'simplified'
						}, {
								gamma: 2
						}, {
								weight: 4
						}]
				}, {
					featureType: 'road.local',
						elementType: 'labels',
						stylers: [{
								visibility: 'off'
						}]
				},{
					featureType: 'poi',
						elementType: 'labels',
						stylers: [{
								visibility: 'off'
						}]
				}, {
						featureType: 'water',
						stylers: [{
								color: '#1A9CE3',
						}, {
								saturation: -50
						}]
				}], {
						name: 'Custom Style'
				});
				var customMapTypeId = 'custom_style';

				var map = new google.maps.Map(document.getElementById('map'), {
						zoom: 17,
						center: {
								lat: 51.458451,
								lng: -0.466705
						},
					zoomControl: false,
          streetViewControl:false,
					mapTypeControlOptions: {
								mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
						}
				});

				map.mapTypes.set(customMapTypeId, customMapType);
				map.setMapTypeId(customMapTypeId);

				// Define the LatLng coordinates for the polygon's path.
				var buildingCoords = [{
								lat: 51.459238,
								lng: -0.466833
						}, {
								lat: 51.4591586,
								lng: -0.466057
						}, {
								lat: 51.458271,
								lng: -0.466293
						}, {
								lat: 51.458357,
								lng: -0.467084
						}

				];

				// Construct the polygon.
				var aiputBuilding = new google.maps.Polygon({
						paths: buildingCoords,
						strokeColor: '#cc0000',
						strokeOpacity: 0.8,
						strokeWeight: 2,
						fillColor: '#cc0000',
						fillOpacity: 0.6
				});
				aiputBuilding.setMap(map);
				// Add a listener for the click event.
				aiputBuilding.addListener('click', showArrays);
				infoWindow = new google.maps.InfoWindow;
	
		/** @this {google.maps.Polygon} */
function showArrays(event) {
		// Since this polygon has only one path, we can call getPath() to return the
		// MVCArray of LatLngs.
		var vertices = this.getPath();

		var contentString = '<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h1 id="firstHeading" class="firstHeading">Building 521a</h1>' +
				'<div id="bodyContent">' +
				'<p>The property was constructed in 2004 and is a transit shed for all of Royal Mail’s international post. It is well serviced with loading bays and benefits from having an ‘airside’ yard. It has integral 3 storey offices fronting on to the Southern Perimeter Road and a good level of car parking. </p>' +
				'</div>' +
				'</div>';

		// Replace the info window's content and position.
		infoWindow.setContent(contentString);
		infoWindow.setPosition(event.latLng);

		infoWindow.open(map);}
}