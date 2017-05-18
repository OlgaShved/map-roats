function initMap() {

  // Create a new StyledMapType object, passing it an array of styles,
  // and the name to be displayed on the map type control.
  var styledMapType = new google.maps.StyledMapType(
    [
      {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{color: '#c9b2a6'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{color: '#dcd2be'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{color: '#ae9e90'}]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#93817c'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{color: '#a5b076'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#447530'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#f5f1e6'}]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{color: '#fdfcf8'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#f8c967'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#e9bc62'}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{color: '#e98d58'}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{color: '#db8555'}]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{color: '#806b63'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{color: '#8f7d77'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#ebe3cd'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{color: '#b9d3c2'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#92998d'}]
      }
    ],
    {name: 'Styled Map'});

  // Create a map object, and include the MapTypeId to add
  // to the map type control.

  var chernihiv = {lat:51.4938438, lng: 31.2999212},
    poltava = {lat: 49.5687001, lng: 34.5835126},
    kyiv = {lat: 50.4492763, lng: 30.5143413},
    odesa = {lat: 46.4836438, lng: 30.7373918};

  var map = new google.maps.Map(document.getElementById('map'), {
    center: chernihiv,
    zoom: 14,
    scrollwheel: false, //Отключить масштабирование на скролл
    mapTypeControl: false, //Убрать элементы выбора типа карты
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
    }
  });

 /* infowindow и маркеры */

  var infowindow = new google.maps.InfoWindow({
    content: "Our Beetroot Academy",
  });

  var image = {
    url: 'favicon.png', // if image is bigger then next
    scaledSize : new google.maps.Size(25, 25)
  };

  var marker_che = new google.maps.Marker({
    position: chernihiv,
    map: map,
    icon: image
  });

  var marker_poltava = new google.maps.Marker({
    position: poltava,
    map: map,
    icon: image
  });

  var marker_kyiv = new google.maps.Marker({
    position: kyiv,
    map: map,
    icon: image
  });

  var marker_odesa = new google.maps.Marker({
    position: odesa,
    map: map,
    icon: image
  });

  infowindow.open(map, marker_che);

  marker_che.addListener('click', function() {
    infowindow.open(map, marker_che);
  });

  /* Поставить нужный город по центру */

  google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter()
    google.maps.event.trigger(map, "resize")
    map.setCenter(center)
  });

  $('select').on('change', function(){
    var val = $(this).val(); //вал - переменная в которой хранятся координаты
    var pos = eval(val);
    //console.log(pos);
    map.panTo(pos);
  });

  /* Инициализируем постройку маршрута */

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  directionsDisplay.setMap(map);
  directionsDisplay.setOptions( { suppressMarkers: true, suppressInfoWindows: true } );

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
}

/* маршрут */

function route(){

  var LatLngA = {
    lat: parseFloat($('#latA').val()),
    lng: parseFloat($('#lngA').val())
  };
  var LatLngB = {
    lat: parseFloat($('#latB').val()),
    lng: parseFloat($('#lngB').val())
  };

  var request = {
    origin: LatLngA,
    destination: LatLngB,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
}

$(document).ready(function(){
  initMap();
});

$('#route').on("click", function() {
  route();
});
