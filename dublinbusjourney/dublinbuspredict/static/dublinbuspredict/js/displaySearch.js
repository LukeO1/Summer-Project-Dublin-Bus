//// Toggle function for route div on map.html
$(document).ready(function(){
	$("#RouteMap1").click(function(){
		$("#toggleRouteMap1").toggle();
	});
});

////Toggle function for route div on map.html
$(document).ready(function(){
	$("#RouteMap2").click(function(){
		$("#toggleRouteMap2").toggle();
	});
});

//Toggles plus and minus icon for Show Details
$(document).ready(function(){
	$("#RouteMap1").click(function(){
		$("#RouteMap1").toggleClass('fa-plus-square fa-minus-square');
	});
});

//Toggles plus and minus icon for More Information
$(document).ready(function(){
	$("#RouteMap2").click(function(){
		$("#RouteMap2").toggleClass('fa-plus-square fa-minus-square');
	});
});

//// Map and Marker related functions for map.html
//$(document).ready(function() {
//    initMap();
//});

var map; // define a map as a global variable for use of different functions
var directionsDisplay;
//var directionsService = new google.maps.DirectionsService();
var service;
var source;
var destination;
var list_origin_dropdown = [];

function initMap() {
    console.log('inside map!')
//	Function to pull in the map
	map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(53.3498053, -6.260309699999993),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }); //closing map creation	

//    Add traffic layer to the map.
	  var trafficLayer = new google.maps.TrafficLayer();
	  trafficLayer.setMap(map);

//	  Add Public transit layer to the map.
	  var transitLayer = new google.maps.TransitLayer();
	  transitLayer.setMap(map);

//	Function to pull in the json from the url.
    $.getJSON("http://127.0.0.1:8000/dublinbuspredict/sampleQuery", null, function(d) {
        var data = d.data;
        var points = new Array; 
        
        var marker, i;
        var infowindow = new google.maps.InfoWindow();
        for (i = 0; i < data.length; i++) {
                var newMarker;
                var intSrc = parseInt(source);
                var intDst = parseInt(destination);               
                if (data[i][0] == intSrc){
               	 newMarker = stopsIconSrc;
                } else if (data[i][0] == intDst){
               	 newMarker = stopsIconDst;
                } else {
               	 newMarker = stopsIcon;
                }     
                marker = new google.maps.Marker({
                position: new google.maps.LatLng(data[i][4], data[i][5]),
                map: map,
                icon: newMarker
            });
         points.push(marker.getPosition());
       

        google.maps.event.addListener(marker, 'click', (function(marker, i){
        	return function() {
        		if (data[i][0] == intSrc){
        			infowindow.setContent("<b>Selected Source<br>Stop ID:&nbsp</b>" + data[i][0] + "<br>" + 	
            				"<b>Location:&nbsp</b>" + data[i][2] + "<br>" + "<b>Street:&nbsp</b>" + data[i][3]);
        			infowindow.open(map,marker);
        		} else if(data[i][0] == intDst){
        			infowindow.setContent("<b>Selected Destination<br>Stop ID:&nbsp</b>" + data[i][0] + "<br>" + 	
        				"<b>Location:&nbsp</b>" + data[i][2] + "<br>" + "<b>Street:&nbsp</b>" + data[i][3]);
        		infowindow.open(map,marker);
        		}
        		else {
        			infowindow.setContent("<b>	Stop ID:&nbsp</b>" + data[i][0] + "<br>" + 	
            				"<b>Location:&nbsp</b>" + data[i][2] + "<br>" + "<b>Street:&nbsp</b>" + data[i][3]);
            		infowindow.open(map,marker);}
        	}
        })(marker, i));
        }

      //Initialize the Path Array
      var path = new google.maps.MVCArray();

      //Initialize the Direction Service
      service = new google.maps.DirectionsService();

      //Set the Path Stroke Color
      var poly = new google.maps.Polyline({ map: map, strokeColor: '#3594D4' });

      //Loop and Draw Path Route between the Points on MAP
      for (var i = 0; i < points.length; i++) {
          if ((i + 1) < points.length) {
              var src = points[i];
              var des = points[i + 1];
              path.push(src);
              poly.setPath(path);
              service.route({
                  origin: src,
                  destination: des,
                  travelMode: google.maps.DirectionsTravelMode.TRANSIT
              })
          }
      }
    });
}

//load in the weather onto map
    var dWeather;
$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=Dublin&units=metric&APPID=33e340fbba76a4645e26160abb37f014", null, function(dWeather) {
    var weatherID = dWeather.weather[0].id;
    var weatherTemp = dWeather.main.temp;
    var weatherDesc = dWeather.weather[0].description;
    weatherDesc = titleCase(weatherDesc);
    var weatherIcon = changeWeatherIcon(weatherDesc);

    $("#wTemp1").addClass("wi wi-thermometer");
    $('#wTemp2').html("&nbsp" + weatherTemp);
    $('#wTemp3').html("°C");
    $('#wIcon').html(weatherIcon);
    $('#wDesc').html(weatherDesc);
    });

function changeWeatherIcon(weatherType) {
    weatherType = weatherType.toLowerCase();
    $("#wIcon").text("");
    $("#wIcon").append("<i></i>");

    if (weatherType.indexOf("clouds") != -1) {
        return $("#wIcon").addClass("wi wi-cloudy");
    } else if (weatherType.indexOf("rain") != -1) {
        return $("#wIcon").addClass("wi wi-rain");
    } else if (weatherType.indexOf("thunderstorm") != -1) {
        return $("#wIcon").addClass("wi wi-thunderstorm");
    } else if (weatherType.indexOf("snow") != -1) {
        return $("#wIcon").addClass("wi wi-snow");
    } else if (weatherType.indexOf("mist") != -1) {
        return $("#wIcon").addClass("wi wi-smoke");
    } else {
        return $("#wIcon").addClass("wi wi-day-sunny");
    }
}

function titleCase(str) {
    var array = str.split(" ");
    for (var i = 0; i < array.length; i++) {
        var temp_array = array[i].split(''); // "ab" => "a","b"
        temp_array[0] = temp_array[0].toUpperCase(); // "a","b" => "A","b"

        for (var j = 1; j < temp_array.length; j++)
            temp_array[j] = temp_array[j].toLowerCase(); // "a","b" => "A","b"
        array[i] = temp_array.join(''); // "A","b" => "Ab"
    }

    return array.join(' ');
}

function loadRoutes(){
    console.log('HEReeeeeeeeeeeeeee!')
    var counter = 0
    var a = $.getJSON("http://127.0.0.1:8000/dublinbuspredict/loadRoutesForMap", null, function(d) {
        $.each(d['list_routes'], function(i, p) {
            $('#dropdown-list-4').append($('<li></li>').val(p).html('<a onclick=getStops2("' + p + '")>' + p + '</a>'));
        })
        $.each(d['list_stops'], function(i, p) {
//            $('#dropdown-list-5').append($('<li></li>').val(p).html('<a onclick=getStopsStartingFromSource2("' + p + '")>' + p + '</a>'));
            list_origin_dropdown.push(p);
        })
    });
    var b = $.getJSON("http://127.0.0.1:8000/dublinbuspredict/getInfoNextPage", null, function(d) {
        console.log('Second call!');
        console.log('Results:', d);
        route = d['route'];
        source = d['source'];
        destination = d['destination'];
        time = d['time']
        date = d['date']
        initMap()
        if (time != "" || date != ""){
            $.getJSON("http://127.0.0.1:8000/dublinbuspredict/runPlanner", {"route":route, "source":source, "destination":destination, "date":date, "time":time}, function(d) {
                console.log('here', d)
            });
        }
        else{
            $.getJSON("http://127.0.0.1:8000/dublinbuspredict/runModel", {"route":route, "source":source, "destination":destination}, function(d) {
                console.log('here', d)
                var d2 = d.info_buses;
                var bus1 = d2[1];
                var bus2 = d2[2];
                console.log("Due time",bus1[0].predicted_arrival_time)
                var first_arrival = new Date(bus1[0].predicted_arrival_time);
                var second_arrival = new Date(bus2[0].predicted_arrival_time);
                console.log("ArrivalTIME", first_arrival)
                var currentTime = new Date();
                console.log(currentTime)
                var diff1 = Math.abs(first_arrival - currentTime);
                var diff2 = Math.abs(second_arrival - currentTime);
                var journey_time1 = 0;
                var journey_time2 = 0;
                var no_stops1;
                var no_stops2;
                                                
                for (var i = 0; i < bus1.length; i++) {
                	var arrival1 = bus1[i].predicted_arrival_time;
                	var newArrival1 = arrival1.slice(11);
                	var stop1 = bus1[i].stopid;
                	journey_time1 += bus1[i].duration;
                	$('#ulOutput1').append('<li class="passed"><b>Arrival Time:&nbsp;</b>' 
                			+ newArrival1 + '&emsp;&emsp;<b>Stop ID:&nbsp</b>' + stop1 +
                			'&emsp;&emsp;<b>Stop Name:&nbsp;</b> Insert Stop Name' + "<br>" 
                			+ '<i class="fa fa-bus fa-x8"></i>'+"<br>"+'</li>');        		
                	no_stops1 +=1;
                }
                $('#dueTime1').append("<b>" + Math.floor(diff1/60000) + " minutes" + "<b>" +"<br>")
                $('#journeyTime1').append("<b>" + Math.floor(journey_time1/ 60) + " minutes" + "</b>")
                
                  if (no_stops1.length < 4) {
                    $('#journeyPrice1').append("<b>Adult:</b> €2.00" + "<br>");
                    $('#journeyPrice1').append("<b>Leap Card:</b> €1.50" + "<br>");
                } else if (no_stops1.length > 3 && no_stops.length < 13){
                    $('#journeyPrice1').append("<b>Adult:</b> €2.70" + "<br>");
                    $('#journeyPrice1').append("<b>Leap Card:</b> €2.05" + "<br>");
                }
                else{
                    $('#journeyPrice1').append("<b>Adult:</b> €3.30" + "<br>");
                    $('#journeyPrice1').append("<b>Leap Card:</b> €2.60" + "<br>");
                }
                
                for (var i = 0; i < bus2.length; i++) {
                	var arrival2 = bus2[i].predicted_arrival_time;
                	var newArrival2 = arrival2.slice(11);
                	var stop2 = bus2[i].stopid;
                	journey_time2 += bus2[i].duration;
                	$('#ulOutput2').append('<br><li class="passed"><b>Arrival Time:&nbsp</b>' + newArrival2 
                			+ '<br><b>Stop ID:&nbsp</b>' + stop2 + "<br>" + '<i class="fa fa-bus"></i>'+"<br>"+ '</li>');        		
                	no_stops2 +=1;
                }
                $('#dueTime2').append("<b>" + Math.floor(diff2/60000) + " minutes" + "</b>" +"<br>")
                $('#journeyTime2').append("<b>" + Math.floor(journey_time2/ 60) + " minutes" + "</b>" + "<br>")
                
                if (no_stops2.length < 4) {
                    $('#journeyPrice2').append("<b>Adult:</b> €2.00" + "<br>");
                    $('#journeyPrice2').append("<b>Leap Card:</b> €1.50" + "<br>");
                } else if (no_stops2.length > 3 && no_stops.length < 13){
                    $('#journeyPrice2').append("<b>Adult:</b> €2.70" + "<br>");
                    $('#journeyPrice2').append("<b>Leap Card:</b> €2.05" + "<br>");
                }
                else{
                    $('#journeyPrice2').append("<b>Adult:</b> €3.30" + "<br>");
                    $('#journeyPrice2').append("<b>Leap Card:</b> €2.60" + "<br>");
                }
            });
        }
    });
}

function searchFunctionRoute2() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("search-box-4");
    filter = input.value.toUpperCase();
    ul = document.getElementById("dropdown-list-4");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function getStops2(route) {
    document.getElementById("search-box-4").value = route;
    console.log(route);
    $.getJSON("http://127.0.0.1:8000/dublinbuspredict/pilotRoutes", {"route":route}, function(d) {
        console.log(d)
        document.getElementById("dropdown-list-5").innerHTML = "";
        document.getElementById("search-box-5").value = "";
        document.getElementById("search-box-6").value = "";
        document.getElementById( "search-box-5").setAttribute( "onkeyup", "javascript: searchFunctionSRC()" );
    $.each(d['stops'], function(i, p) {
        $('#dropdown-list-5').append($('<li></li>').val(p).html('<a onclick=getStopsDest2(' + p + ')>' + route + ' - ' + p + '</a>'));
    });
    });
}

function searchFunctionSRC2() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("search-box-5");
    filter = input.value.toUpperCase();
    ul = document.getElementById("dropdown-list-5");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function getStopsDest2(source) {
    document.getElementById("search-box-5").value = source;
    console.log('Source:', source);
    route = document.getElementById("search-box-4").value;
    console.log ('Route:', route)
    $.getJSON("http://127.0.0.1:8000/dublinbuspredict/pilotDest", {"route":route, "source":source}, function(d) {
        console.log(d)
        document.getElementById("dropdown-list-6").innerHTML = "";
        document.getElementById("search-box-6").value = "";
    $.each(d['stops'], function(i, p) {
        $('#dropdown-list-6').append($('<li></li>').val(p).html('<a onclick=getStopsDestExtra2(' + p + ')>' + route + ' - ' + p + '</a>'));
    });
    });
}

function getStopsDestExtra2(stop){
    document.getElementById("search-box-6").value = stop;
}

function searchFunctionDest2() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("search-box-6");
    filter = input.value.toUpperCase();
    ul = document.getElementById("dropdown-list-6");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function getStopsStartingFromSource2(stop){
    console.log('Stop is', stop)
    document.getElementById("search-box-5").value = stop
    $.getJSON("http://127.0.0.1:8000/dublinbuspredict/getStopsStartingFromSource", {"source":stop}, function(d) {
        console.log(d)
        document.getElementById("dropdown-list-4").innerHTML = "";
        document.getElementById("search-box-4").value = "";
        document.getElementById("dropdown-list-6").innerHTML = "";
        document.getElementById("search-box-6").value = "";
    $.each(d['stops'], function(i, p) {
        console.log(p)
        $('#dropdown-list-6').append($('<li></li>').val(p).html('<a onclick=getStopsDestExtraRoute2(' + p + ')>'+ p + '</a>'));
    });
    });
}

function getStopsDestExtraRoute2(route){
    document.getElementById("search-box-6").value = route;
    source = document.getElementById("search-box-5").value;
    dest = document.getElementById("search-box-6").value;
    $.getJSON("http://127.0.0.1:8000/dublinbuspredict/getStopsDestExtraRoute", {"source":source, "dest":dest}, function(d) {
        console.log(d)
    $.each(d['routes'], function(i, p) {
        console.log(p)
        $('#dropdown-list-4').append($('<li></li>').val(p).html('<a onclick=getExtraRoute2(' + p + ')>'+ p + '</a>'));
    });
    });
}

function getExtraRoute2(route){
    document.getElementById("search-box-4").value = route;
}

function loadRoutes2(){
    console.log('HEReeeeeeeeeeeeeee!')
    var counter = 0
    document.getElementById("dropdown-list-4").innerHTML = "";
    document.getElementById("search-box-4").value = "";
    document.getElementById("dropdown-list-5").innerHTML = "";
    document.getElementById("search-box-5").value = "";
    document.getElementById("dropdown-list-6").innerHTML = "";
    document.getElementById("search-box-6").value = "";
    document.getElementById( "search-box-5").setAttribute( "onkeyup", "javascript: newSearch2()" );
    var a = $.getJSON("http://127.0.0.1:8000/dublinbuspredict/loadRoutesForMap", null, function(d) {
        $.each(d['list_routes'], function(i, p) {
            $('#dropdown-list-4').append($('<li></li>').val(p).html('<a onclick=getStops2("' + p + '")>' + p + '</a>'));
        })
//        $.each(d['list_stops'], function(i, p) {
//            $('#dropdown-list-5').append($('<li></li>').val(p).html('<a onclick=getStopsStartingFromSource2("' + p + '")>' + p + '</a>'));
//        })
    });
}

function loadOrigin2(){
    console.log('hereee!')
    $.getJSON("http://127.0.0.1:8000/dublinbuspredict/loadRoutesForMap", null, function(d) {
             $.each(d['list_stops'], function(i, p) {
                list_origin_dropdown.push(p);
             });
    });
}

function newSearch2(){
    stop = document.getElementById('search-box-5').value;
    console.log(stop);
    var node;
    var textnode;
    text = '';
    document.getElementById("dropdown-list-5").innerHTML = "";
    var i;
    for(i = 0; i < list_origin_dropdown.length; i++){
        if (list_origin_dropdown[i].toString().indexOf(stop.toString()) != -1){
            if (stop.length > 0){
                var same = true;
                for (var j = 0; j < stop.length; j++){
                    if (stop[j] != list_origin_dropdown[i].toString()[j]){
                        same = false
                    }
                }
                if (same == true){
                    text += '<li><a onclick="getStopsStartingFromSource2('+ list_origin_dropdown[i] +')">' + list_origin_dropdown[i] + '</a></li>'
                }
            }
        }
    }
    document.getElementById("dropdown-list-5").innerHTML = text;
}
