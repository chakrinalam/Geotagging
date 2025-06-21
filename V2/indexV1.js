const loc = document.getElementById("location");
const locationBtn = document.getElementById("locationBtn");
const historyList = document.getElementById("historyList");
const shareContainer = document.getElementById("share");
let map, marker;

function initMap() {
    map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);
}

function updateMap(lat, lon) {
    if (!marker) {
        marker = L.marker([lat, lon]).addTo(map);
    } else {
        marker.setLatLng([lat, lon]);
    }
    map.setView([lat, lon], 15);
}

function addToHistory(lat, lon) {
    const li = document.createElement("li");
    li.textContent = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)} - ${new Date().toLocaleTimeString()}`;
    historyList.prepend(li);
}

function shareLocation(lat, lon) {
    const message = `I'm here: https://www.google.com/maps?q=${lat},${lon}`;
    shareContainer.innerHTML = `
        <a class="share-link" href="https://wa.me/?text=${encodeURIComponent(message)}" target="_blank">Share via WhatsApp</a>
        <a class="share-link email-link" href="mailto:?subject=My Location&body=${encodeURIComponent(message)}">Share via Email</a>
      `;
}

function getLocation() {
    loc.textContent = "Fetching location...";

    if (!navigator.geolocation) {
        loc.textContent = "Geolocation not supported.";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;

            loc.innerHTML = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)} (±${Math.round(accuracy)}m)
          <br><a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">Open in Google Maps</a>`;

            updateMap(latitude, longitude);
            addToHistory(latitude, longitude);
            shareLocation(latitude, longitude);
        },
        (err) => {
            loc.textContent = "Error: " + err.message;
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Button behavior
locationBtn.addEventListener("click", () => {
    getLocation();
    locationBtn.textContent = "Reset Location";
    locationBtn.classList.add("reset"); // 🔴 Apply red color after first click
});

initMap();
