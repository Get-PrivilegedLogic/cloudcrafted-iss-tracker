let map = L.map('map').setView([0, 0], 2);
let issMarker;
let issIcon = L.icon({
    iconUrl: 'iss.png',
    iconSize: [50, 32],
    iconAnchor: [25, 16]
});
let firstLoad = true;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

async function updateISS() {
    try {
        const response = await fetch('https://7lqytqrrzl.execute-api.us-east-1.amazonaws.com/prod/position');
        const data = await response.json();
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);

        if (!issMarker) {
            issMarker = L.marker([lat, lng], { icon: issIcon }).addTo(map);
        } else {
            issMarker.setLatLng([lat, lng]);
        }

        if (firstLoad) {
            map.setView([lat, lng], 4); // Only recenter on first load
            firstLoad = false;
        }
    } catch (error) {
        console.error('Failed to fetch ISS data:', error);
    }
}

async function fetchAndRenderTrail() {
    try {
        const response = await fetch('https://7lqytqrrzl.execute-api.us-east-1.amazonaws.com/prod/trail');
        const trailData = await response.json();

        if (Array.isArray(trailData) && trailData.length > 1) {
            const latlngs = trailData.map(point => [parseFloat(point.lat), parseFloat(point.lng)]);
            const trailLine = L.polyline(latlngs, { color: 'red' }).addTo(map);
            map.fitBounds(trailLine.getBounds(), { padding: [20, 20] });
        } else {
            console.warn('Trail data not sufficient to draw a line.');
        }
    } catch (error) {
        console.error('Error loading ISS trail:', error);
    }
}

// Run updates
updateISS();
fetchAndRenderTrail();
