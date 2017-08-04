
function tourismMap(){
    console.log('Tourism Map function')
    var points_of_interest = [
        [0, "<b><u>Attraction</u></b><br><br> <b>Name: </b>Trinity College Dublin<br><b>Type: </b>Point of Interest<br><b>Address: </b>College Green, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://www.tcd.ie/visitors/book-of-kells/">Trinity College</a>', '53.34369', '-6.25919'],
        [1, "<b><u>Attraction</u></b><br><br> <b>Name: </b>National Gallery of Ireland<br><b>Type: </b>Museum & Gallery<br><b>Address: </b>Merrion Square West, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://www.nationalgallery.ie/">National Gallery of Ireland</a>', '53.3409059', '-6.252502499999991'],
        [2, "<b><u>Attraction</u></b><br><br> <b>Name: </b>The Little Museum of Dublin<br><b>Type: </b>Museum<br><b>Address: </b>15 St Stephen's Green, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://www.littlemuseum.ie/">The Little Museum of Dublin</a>', '53.339612', '-6.258326000000011'],
        [3, "<b><u>Attraction</u></b><br><br> <b>Name: </b>The G.P.O<br><b>Type: </b>Museum<br><b>Address: </b>O'Connell Street Lower, Dublin 1<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.gpowitnesshistory.ie/">The G.P.O</a>', '53.349349', '-6.2607209999999895'],
        [4, "<b><u>Attraction</u></b><br><br> <b>Name: </b>Collins Barracks<br><b>Type: </b>Museum<br><b>Address: </b>Benburb Street, Dublin 7<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.museum.ie/Decorative-Arts-History">Museum</a>', '53.3479417', '-6.285923099999991'],
        [5, "<b><u>Attraction</u></b><br><br> <b>Name: </b>Dublin Castle<br><b>Type: </b>Museum<br><b>Address: </b>Dame Street, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.dublincastle.ie/">Dublin Castle</a>', '53.34288609999999', '-6.267428399999972'],
        [6, "<b><u>Attraction</u></b><br><br> <b>Name: </b>Irish Museum of Modern Art (IMMA)<br><b>Type: </b>Museum & Gallery<br><b>Address: </b>Royal Hospital Kilmainham, Military Rd,Dublin 8<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.imma.ie/en/index.htm">IMMA</a>', '53.344719', '-6.300155'],
        [7, "<b><u>Attraction</u></b><br><br> <b>Name: </b>St. Patrick's Cathedral<br><b>Type: </b>Religion<br><b>Address: </b>Wood Quay, Dublin 8<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://www.stpatrickscathedral.ie/">St. Patricks Cathedral</a>', '53.3395154', '-6.271476699999994'],
        [8, "<b><u>Attraction</u></b><br><br> <b>Name: </b>Guinness Storehouse<br><b>Type: </b>Tour & Culture<br><b>Address: </b>St James's Gate, Dublin 8<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://www.guinness-storehouse.com/en">Guinness Storehouse</a>', '53.3419', '-6.2868'],
        [9, "<b><u>Attraction</u></b><br><br> <b>Name: </b>Old Jameson Distellery<br><b>Type: </b>Tour & Culture<br><b>Address: </b>Bow Street, Smithfield Village, Dublin 7<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://www.jamesonwhiskey.com/ie/visit-us/jameson-distillery-bow-st">Jameson Distellery</a>', '53.3483761', '-6.277354400000036'],
        [10, "<b><u>Attraction</u></b><br><br> <b>Name: </b>Dublin Zoo<br><b>Type: </b>Family-friendly<br><b>Address: </b>Phoenix Park, Dublin 8<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://www.dublinzoo.ie/">Dublin Zoo</a>', '53.3561935', '-6.305289799999969'],
        [11, "<b><u>Attraction</u></b><br><br> <b>Name: </b>Farmleigh House<br><b>Type: </b>Museum & Garden<br><b>Address: </b>White's Road, Dublin 8<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.farmleigh.ie/">Farmleigh House</a>', '53.36510000000001', '-6.3585050000000365'],
        [12, "<b><u>Attraction</u></b><br><br> <b>Name: </b>Grafton Street<br><b>Type: </b>Shopping<br><b>Address: </b>Grafton Street, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://graftonstreet.ie/">Grafton Street</a>', '53.342154', '-6.259843499999988'],
        [13, "<b><u>Attraction</u></b><br><br> <b>Name: </b>St. Stephen's Green<br><b>Type: </b>Park<br><b>Address: </b>St. Stephen's Green, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://ststephensgreenpark.ie/">St. Stephens Green</a>', '53.3381736', '-6.259119000000055'],
        [14, "<b><u>Attraction</u></b><br><br> <b>Name: </b>National Botanic Gardens<br><b>Type: </b>Park<br><b>Address: </b>Glasnevin, Dublin 9<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.botanicgardens.ie/">Botanic Gardens</a>', '53.3716672', '-6.270401799999945'],
                
        [15, "<b><u>Venue</u></b><br><br> <b>Name: </b>The Point<br><b>Address: </b>North Wall Quay, North Dock, Dublin 1<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://3arena.ie/">3Arena</a>', '53.347496', '-6.228508'],
        [16, "<b><u>Venue</u></b><br><br> <b>Name: </b>Croke Park<br><b>Address: </b>Jones' Rd, Drumcondra, Dublin 3<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://crokepark.ie/concerts">Croke Park</a>', '53.360712', '-6.251209'],
        [17, "<b><u>Venue</u></b><br><br> <b>Name: </b>The National Concert Hall<br><b>Address: </b>Earlsfort Terrace, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://www.nch.ie/Online/Whats-On">National Concert Hall</a>', '53.334784', '-6.258189'],
        [18, "<b><u>Venue</u></b><br><br> <b>Name: </b>Vicar Street<br><b>Address: </b>58-59 Thomas St, The Liberties, Dublin 8<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.vicarstreet.ie/all-shows-at-vicar-street.html">Vicar Street</a>', '53.342607', '-6.277983'],
        [19, "<b><u>Venue</u></b><br><br> <b>Name: </b>The Olympia Theatre<br><b>Address: </b>72 Dame St, Temple Bar, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.olympia.ie/whats-on/">The Olympia Theatre</a>', '53.344313', '-6.266080'],
        [20, "<b><u>Venue</u></b><br><br> <b>Name: </b>Aviva Stadium<br><b>Address: </b>Lansdowne Rd, Dublin 4<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.avivastadium.ie/">Aviva Stadium</a>', '53.335232', '-6.228457'],
        [21, "<b><u>Venue</u></b><br><br> <b>Name: </b>RDS Arena<br><b>Address: </b>Anglesea, Dublin 4<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="https://www.rds.ie/Whats-On">The RDS Arena</a>', '53.325718', '-6.229688'],
        [22, "<b><u>Venue</u></b><br><br> <b>Name: </b>Phoenix Park<br><b>Address: </b>Phoenix Park, Dublin 8<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.phoenixpark.ie/newsevents/">Phoenix Park</a>', '53.355882', '-6.329813'],
        [23, "<b><u>Venue</u></b><br><br> <b>Name: </b>Irish Museum of Modern Art (IMMA)<br><b>Address: </b>Royal Hospital Kilmainham, Military Rd, Dublin 8<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.rhk.ie/rhk-events.html">Royal Hospital Kilmainham (IMMA)</a>', '53.343605', '-6.304168'],
        [24, "<b><u>Venue</u></b><br><br> <b>Name: </b>The Convention Centre<br><b>Address: </b>Spencer Dock, N Wall Quay, North Dock, Dublin 1<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.theccd.ie/whats-on">The Convention Centre</a>', '53.348052', '-6.239398'],
        [25, "<b><u>Venue</u></b><br><br> <b>Name: </b>Iveagh Gardens<br><b>Address: </b>Clonmel St, Saint Kevin's, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://iveaghgardens.ie/events/">Iveagh Gardens</a>', '53.335138', '-6.261034'],
        [26, "<b><u>Venue</u></b><br><br> <b>Name: </b>Bord Gais Energy Theatre<br><b>Address: </b>Grand Canal Quay, Grand Canal Dock, Dublin 2<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.bordgaisenergytheatre.ie/whats-on">Bord Gais Energy Theatre</a>', '53.344213', '-6.240104'],
        [27, "<b><u>Venue</u></b><br><br> <b>Name: </b>Marlay Park<br><b>Address: </b>Grange Road, Rathfarnham, Dublin 16<br><b>Routes:</b><br><br>" + '<b>Website: </b><a target="_blank" href="http://www.dlrcoco.ie/en/parks-outdoors/marlay-park-concerts">Marlay Park</a>', '53.2733', '-6.2689'],

    ];

	// Declaring the map, info-windows, markers, and iterators
    var map = new google.maps.Map(document.getElementById('map_tourism'), {
        zoom: 14,
        center: new google.maps.LatLng(53.3444281399357, -6.259417531374538),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();
    var marker, i;
	
	// Looping through the first 8 by coordinates to place Museum marker
    for (i = 0; i < 8; i++) {
        marker = new Marker({
            position: new google.maps.LatLng(points_of_interest[i][2], points_of_interest[i][3]),
            map: map,
            icon: {
				path: MAP_PIN,
				fillColor: '#0c2864',
				fillOpacity: 1,
				strokeColor: '',
				strokeWeight: 0
			},
			map_icon_label: '<i class="fa fa-university fa-2x" style="margin-bottom:20px; color:white; margin-left:2px;"></i>'
            //icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(points_of_interest[i][1]);
                infowindow.open(map, marker);
            }
        })(marker, i));

    }
	
	// Looping through the next 2 by coordinates to place Drinks marker
	for (i = 8; i < 10; i++) {
        marker = new Marker({
            position: new google.maps.LatLng(points_of_interest[i][2], points_of_interest[i][3]),
            map: map,
            icon: {
				path: MAP_PIN,
				fillColor: '#0c2864',
				fillOpacity: 1,
				strokeColor: '',
				strokeWeight: 0
			},
			map_icon_label: '<i class="fa fa-glass fa-2x" style="margin-bottom:17px; color:white;"></i>'
            //icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(points_of_interest[i][1]);
                infowindow.open(map, marker);
            }
        })(marker, i));

    }
    
    // Looping through the next 2 by coordinates to place Sights marker
    for (i = 10; i < 12; i++) {
        marker = new Marker({
            position: new google.maps.LatLng(points_of_interest[i][2], points_of_interest[i][3]),
            map: map,
            icon: {
				path: MAP_PIN,
				fillColor: '#0c2864',
				fillOpacity: 1,
				strokeColor: '',
				strokeWeight: 0
			},
			map_icon_label: '<i class="fa fa-binoculars fa-2x" style="margin-bottom:17px; color:white;"></i>'
            //icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(points_of_interest[i][1]);
                infowindow.open(map, marker);
            }
        })(marker, i));

    }
    
    // Looping through the next element by coordinates to place Shopping marker
    for (i = 12; i < 13; i++) {
        marker = new Marker({
            position: new google.maps.LatLng(points_of_interest[i][2], points_of_interest[i][3]),
            map: map,
            icon: {
				path: MAP_PIN,
				fillColor: '#0c2864',
				fillOpacity: 1,
				strokeColor: '',
				strokeWeight: 0
			},
			map_icon_label: '<i class="fa fa-shopping-bag fa-2x" style="margin-bottom:17px; color:white;"></i>'
            //icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(points_of_interest[i][1]);
                infowindow.open(map, marker);
            }
        })(marker, i));

    }
    
    // Looping through the next 2 by coordinates to place Outdoors marker
    for (i = 13; i < 15; i++) {
        marker = new Marker({
            position: new google.maps.LatLng(points_of_interest[i][2], points_of_interest[i][3]),
            map: map,
            icon: {
				path: MAP_PIN,
				fillColor: '#0c2864',
				fillOpacity: 1,
				strokeColor: '',
				strokeWeight: 0
			},
			map_icon_label: '<i class="fa fa-tree fa-2x" style="margin-bottom:17px; color:white;"></i>'
            //icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(points_of_interest[i][1]);
                infowindow.open(map, marker);
            }
        })(marker, i));

    }
	
	// Looping through final 13 by coordinates to place Venue marker
    for (i = 15; i < points_of_interest.length; i++) {
        marker = new Marker({
            position: new google.maps.LatLng(points_of_interest[i][2], points_of_interest[i][3]),
            map: map,
            icon: {
				path: MAP_PIN,
				fillColor: '#FFD527',
				fillOpacity: 1,
				strokeColor: '',
				strokeWeight: 0
			},
			map_icon_label: '<i class="fa fa-music fa-2x" style="margin-bottom:17px; color:white;"></i>'
            //icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(points_of_interest[i][1]);
                infowindow.open(map, marker);
            }
        })(marker, i));

    }
    
	// Adapted from: https://developers.google.com/maps/documentation/javascript/examples/map-geolocation
    infoWindow = new google.maps.InfoWindow;
    
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            marker = new Marker({
            	position: pos,
            	map: map,
            	icon: {
					path: MAP_PIN,
					fillColor: '#3594D4',
					fillOpacity: 1,
					strokeColor: '',
					strokeWeight: 0
			},
			map_icon_label: '<i class="fa fa-male fa-2x" style="margin-bottom:17px; color:white; margin-left:1px;"></i>'
        });  
            

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found');
            infoWindow.open(map, marker);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
}

// Toggle function for Tourist Table on tourism.html
$(document).ready(function(){
	$("#TourismButton").click(function(){
		$("#toggleTourismTable").toggle();
	});
});

// Toggle function for Venues Table on tourism.html
$(document).ready(function(){
	$("#VenuesButton").click(function(){
		$("#toggleVenuesTable").toggle();
	});
});

// Stephen: Testing functions for linking information tables to map with on-click functionality
//var test = document.getElementById('test');
//test.onclick = function(){
//	for (i = 0; i < points_of_interest.length; i++){
//		var lat = points_of_interest[i][2];
//		var long = points_of_interest[i][3];
//		var mapOptions = {
//			center: new.google.maps.LatLng(lat,long),
//			zoom: 17
//		};
//		var map = new google.maps.Map(document.getElementById("map_tourism"), mapOptions);
//			}
//		});
//	}
//}

//$(document).ready(function() {
//    $(document).on("click", ".button", function(e) {
//        var latLng = $(this).attr("data-latLng");			
//        findLocation(latLng);
//    });
//    
//    function findLocation(latLng) {
//    	tourismMap()
//        latLng = latLng.split(",")
//        var mapOptions = {
//            center: new google.maps.LatLng(latLng[0],latLng[1]),
//            zoom: 17
//        };
//        var map = new google.maps.Map(document.getElementById("map_tourism"), mapOptions);
//    }
//});
