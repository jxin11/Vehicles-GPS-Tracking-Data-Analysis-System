var activity_route;
var animation;
// var timeAnimation;

function selectFunctionTrip(arr) {
  var x = document.getElementById("selectRoadTrip").value;
  const datafilter = arr.filter(d => d['date'] === x);  
  myMap(datafilter);
}

function myMap(data) {

  var lat = data.map(function(item) { return item['lat']; });
  var lon = data.map(function(item) { return item['lon']; });
  var total_lat = 0;
  var total_lon = 0;
  var time = data.map(function(item) { return item['time']; });;
  
  for(var i = 0; i < lat.length; i++) {
    total_lat += lat[i];
    total_lon += lon[i];
  }
  
  var mapProp= {
    center: {lat: 0, lng: 0},
    zoom:15,
  };

  var map = new google.maps.Map(document.getElementById("map_canvas"), mapProp);
  var tripCoordinates = [];
  var bounds = new google.maps.LatLngBounds();

  for (i=0; i<lat.length; i++){
    var point = new google.maps.LatLng(lat[i], lon[i]);
    tripCoordinates.push(point);
    bounds.extend(point);
  }

  activity_route = new google.maps.Polyline({
    path: tripCoordinates,
    geodesic: true,
    strokeColor: '#0d11ff',
    strokeOpacity: 8.0,
    strokeWeight: 3,
    icons: [{
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: '#393'
      },
      offset: '100%'
    }],
    map: map
  });

  map.fitBounds(bounds);       //auto-zoom
  map.panToBounds(bounds);     //auto-center

  var start = new google.maps.Marker({
    position: tripCoordinates[0],
    map: map,
    label: 'S'
  });

  var end = new google.maps.Marker({
    position: tripCoordinates[tripCoordinates.length-1],
    map: map,
    label: 'E'
  });

  var infowindow = new google.maps.InfoWindow({});

  function setContent(text){
    infowindow = new google.maps.InfoWindow({
      content: text
    });
  }

  google.maps.event.addListener(start, 'mouseover', function() {
    setContent(time[0]);
    infowindow.open(map,start);
  });

  google.maps.event.addListener(start, 'mouseout', function() {
    infowindow.close();
  });

  google.maps.event.addListener(end, 'mouseover', function() {
    setContent(time[time.length-1]);
    infowindow.open(map,end);
  });

  google.maps.event.addListener(end, 'mouseout', function() {
    infowindow.close();
  });

  for (i = 1; i < (tripCoordinates.length-1); i++) {
    var circle = new google.maps.Circle({    
        fillColor: '#0d11ff',
        strokeColor: '#0d11ff',
        center: tripCoordinates[i],
        title: time[i],
        radius: 8,
        strokeOpacity: 1,
        fillOpacity: 1,
        map: map      
    });

    createClickableCircle(map, circle, time[i]); 

  };

  function createClickableCircle(map, circle, info){
    
    var infowindow =new google.maps.InfoWindow({
      content: info
    }); 

    google.maps.event.addListener(circle, 'mouseover', function(ev) {
      infowindow.setPosition(circle.getCenter());
      infowindow.open(map);
    });

    google.maps.event.addListener(circle, 'mouseout', function(ev) {
      infowindow.close();
    });
  }

  window.clearInterval(animation);
  animate();

  // window.clearInterval(timeAnimation);
  // displayTime(time);
}

function animate() {
  
  var count = 0;
  animation = setInterval(function() {
    count = (count + 1) % 200;
    var icons = activity_route.get('icons');
    icons[0].offset = (count / 2) + '%';
    activity_route.set('icons', icons);
  }, 150);

}

function displayTime(time){

  var i = 0;

  timeAnimation = setInterval(function() {
    $("#time").html(time[i]);
      if (i == time.length) {
        i = 0;
      }
      else {
        i++;
      }
  }, 240);
}