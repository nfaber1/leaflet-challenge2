
// store our api endpoint inside queryurl
var queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// perform a GET request to the query URL
d3.json(queryurl, function (data) {
    console.log(data)
    // once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

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

    // createMap(earthquakes);
};

