$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mmsi = urlParams.get('mmsi');

    if (!mmsi) {
        console.warn("No MMSI provided in the URL.");
        return; // Stop execution if MMSI is missing
    }

    // Load the static JSON file
    $.getJSON('historcal_route.json', function(data) {
        if (data.routes[mmsi]) {
            plotRoute(data.routes[mmsi]);
        } else {
            console.warn(`No historical demo data available for MMSI: ${mmsi}`);
        }
    }).fail(function() {
        console.error("Failed to load historical demo data.");
    });
});



let routePolyline; // Store the polyline to manage it later
let markers = []; // Store markers for later removal

function plotRoute(historicalData) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = []; // Reset the markers array

    // Clear existing polyline if it exists
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }

    if (historicalData.length === 0) {
        console.warn("No historical data available to plot.");
        return;
    }

    // Collect coordinates for the polyline
    let coordinates = historicalData.map(point => [point.lat, point.lon]);

    // Add start and end circle markers
    const startPoint = historicalData[0];
    const endPoint = historicalData[historicalData.length - 1];

    // Start point marker (green)
    let startMarker = L.circleMarker([startPoint.lat, startPoint.lon], {
        color: 'green',
        radius: 8,
        weight: 3,
        fillOpacity: 0.8
    }).addTo(map).bindPopup("Start Point");
    markers.push(startMarker);

    // End point marker (red)
    let endMarker = L.circleMarker([endPoint.lat, endPoint.lon], {
        color: 'red',
        radius: 8,
        weight: 3,
        fillOpacity: 0.8
    }).addTo(map).bindPopup("End Point");
    markers.push(endMarker);

    // Create and add the polyline to connect the points
    routePolyline = L.polyline(coordinates, {
        color: 'blue', // Line color
        weight: 4,     // Line thickness
        opacity: 0.5,  // Transparency level
        dashArray: [20, 10],
    }).addTo(map);

    // Fit the map view to the polyline bounds
    map.fitBounds(routePolyline.getBounds(), { padding: [50, 50], maxZoom: 12 });
}
