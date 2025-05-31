const positionApiUrl = "https://7lqytqrrzl.execute-api.us-east-1.amazonaws.com/prod/position";
const trailApiUrl = "https://7lqytqrrzl.execute-api.us-east-1.amazonaws.com/prod/trail";

const map = L.map("map").setView([0, 0], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

const issIcon = L.icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg",
  iconSize: [50, 32],
  iconAnchor: [25, 16]
});

const marker = L.marker([0, 0], { icon: issIcon }).addTo(map);

async function updateISS() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const { latitude, longitude } = data;
    marker.setLatLng([latitude, longitude]);
    map.setView([latitude, longitude], map.getZoom());
  } catch (err) {
    console.error("Failed to fetch ISS data:", err);
  }
}
async function fetchAndRenderTrail(map) {
  try {
    const response = await fetch(trailApiUrl);
    const data = await response.json();

    const pathCoords = data.map(point => [
      parseFloat(point.lat),
      parseFloat(point.lng)
    ]);

    L.polyline(pathCoords, { color: 'red' }).addTo(map);
  } catch (error) {
    console.error('Error loading ISS trail:', error);
  }
}
updateISS();
setInterval(updateISS, 10000); // update every 10 sec
fetchAndRenderTrail(map);

