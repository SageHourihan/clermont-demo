var isDemoMode = true;
var demoMarkers = [];

$(document).ready(function() {
    // Load ships data from JSON file
    loadDemoShipsData();

    // Add demo mode indicator
    $('body').append('<div id="demoIndicator">DEMO MODE</div>');

    // Delegate event listener for dynamically added buttons
    $(document).on('click', '#route_btn', function() {
        var mmsi = $(this).data('mmsi');
        window.location.href = `historical_route_demo.html?mmsi=${mmsi}`;
    });
});

function loadDemoShipsData() {
    $.getJSON('ships.json', function(data) {
        displayDemoShips(data.ships);
    }).fail(function() {
        console.error("Could not load demo ships data");
    });
}

function displayDemoShips(ships) {
    // Clear existing demo markers
    clearDemoMarkers();

    // Add ships to map
    ships.forEach(function(ship) {
        addDemoShipMarker(ship);
    });
}

function addDemoShipMarker(ship) {
    var icon = L.icon({
        iconUrl: 'cargo-ship.png',
        iconSize: [30, 30],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    var marker = L.marker([ship.lat, ship.lon], {icon: icon}).addTo(map);

    // Add to demo markers array
    demoMarkers.push(marker);

    // Add click event to show detail panel
    marker.on('click', function() {
        showDemoShipDetails(ship);
    });
}

function showDemoShipDetails(ship) {
    var detailContent = `
        <div class="detail-panel">
            <h2>${ship.name} (DEMO)</h2>
            <span class="close-btn" onclick="$('#shipDetailPanel').fadeOut();">&times;</span>
            <div class="detail-content">
                <p><strong>MMSI:</strong> ${ship.mmsi}</p>
                <p><strong>Type:</strong> ${ship.type}</p>
                <p><strong>Speed:</strong> ${ship.speed} knots</p>
                <p><strong>Course:</strong> ${ship.course}°</p>
                <p><strong>Destination:</strong> ${ship.destination}</p>
                <p><strong>ETA:</strong> ${formatDemoDate(ship.eta)}</p>
                <p><strong>Status:</strong> ${ship.status}</p>
                <button id='route_btn' data-mmsi="${ship.mmsi}">Get Route</button>
            </div>
        </div>
    `;

    $('#shipDetailPanel').html(detailContent).show();
}

function formatDemoDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleString();
}

function clearDemoMarkers() {
    demoMarkers.forEach(function(marker) {
        map.removeLayer(marker);
    });
    demoMarkers = [];
}
