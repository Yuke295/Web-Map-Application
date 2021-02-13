var mymap = L.map('map', {
    center: [47.7511, -120.7401],
    zoom: 5,
    maxZoom: 10,
    minZoom: 2,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add cell towers GeoJSON Data
// Null variable that will hold airports data
var airports = null;

// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('PiYG').mode('1ch').colors(2);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
};

// Get GeoJSON and put on it on the map when it loads
airports= L.geoJson.ajax("assets/airports.geojson", {
    onEachFeature: function (feature, layer) {
        layer.bindPopup("<h2>" + feature.properties.AIRPT_NAME+ "</h2>"  + "<b>" + feature.properties.CITY + ", " + feature.properties.STATE);
    //    return feature.properties.LOCCOUNTY;
    },
    pointToLayer: function (feature, latlng) {
        var id = 0;
        if (feature.properties.CNTL_TWR == "Y") { id = 0; }
        else  { id = 1; }
        return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
    },
    attribution: 'Airports in the United States  | Washington counties &copy; Washington Data & Research | Base Map &copy; CartoDB | Made By Yuke Cao'
}).addTo(mymap);

//L.Marker.setBouncingOptions({bounceHeight : 60, bounceSpeed : 54}).addTo(mymap);

// 6. Set function for color ramp
colors = chroma.scale('BuPu').colors(5);

function setColor(density) {
    var id = 0;
    if (density > 41) { id = 4; }
    else if (density > 31 && density <= 40) { id = 3; }
    else if (density > 21 && density <= 30) { id = 2; }
    else if (density > 11 &&  density <= 20) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// 7. Set style function that sets fill color.md property equal to airports density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#d6cbd3',
        dashArray: '4'
    };
}

// 8. Add county polygons
// create country variable, and assign null to it.
var country = null;
country = L.geoJson.ajax("assets/us-states.geojson", {
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<h2>" + feature.properties.name + "</h2>" + 'Airport number: ' + feature.properties.count);
  },
    style: style
}).addTo(mymap);


// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright', disableVisibilityControls: 'true'});

// 10. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b># Airports</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 41+ </p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 31-40 </p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 21-30 </p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 11-20 </p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-10 </p>';
    div.innerHTML += '<hr><b>Type<b><br />';
    div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> Airport Has Air Traffic Control Tower</p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> Airport </p>';
    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
