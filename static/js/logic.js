
// store our api endpoint inside queryurl
var queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// perform a GET request to the query URL
d3.json(queryurl, function (data) {
    console.log(data)
    // once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function markSize(size) {
    return size * 50000;
};

function createFeatures(earthquakeData) {

    // define a function we want to run once for each feature in the features array
    // give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // create a GeoJSON layer containing the features array on the earthquakeData object
    // run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // create marksize
    function markSize(size) {
        return size * 50000;
    };

    // define mark color depending on depth from surface
    function markColor(depth) {
        if (depth < 10) {
            return "#71FF33"
        } else if (depth < 30) {
            return "#E9FF33"
        } else if (depth < 50) {
            return "#FFC133"
        } else if (depth < 70) {
            return "#FF8D33"
        } else if (depth < 90) {
            return "#FF3933"
        } else if (depth < 110) {
            return "#F90E07"
        }
    };

    // create list
    var magnitudeMarkers = [];

    for (var i = 0; i < earthquakeData.length; i++) {

        // setting the marker radius for the magnitude by passing magnitude property into the markerSize function
        magnitudeMarkers.push(
            L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
                stroke: false,
                fillOpacity: 0.75,
                stroke: "#2A2323",
                fillColor: markColor(earthquakeData[i].geometry.coordinates[2]),
                radius: markSize(earthquakeData[i].properties.mag)
            })
        );
    }

    createMap(earthquakes, magnitudeMarkers);
};

function createMap(earthquakes, magnitudeMarkers) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "?? <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> ?? <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery ?? <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  

