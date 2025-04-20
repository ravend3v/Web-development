let map; // Map instance
let userLocation = null;

// Add a "Locate Me" button to the map
function addLocateMeButton() {
    const locateMeButton = L.control({ position: 'topright' });

    locateMeButton.onAdd = function () {
        const button = L.DomUtil.create('button', 'locate-me-button');
        button.textContent = 'Sijaintini';
        button.title = 'Siirry sijaintiisi';
        button.style.cursor = 'pointer';
        button.style.padding = '10px';
        button.style.backgroundColor = '#0073e6';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        button.addEventListener('click', () => {
            if (userLocation) {
                map.setView(userLocation, 14);
            } else {
                alert('Sijaintia ei ole saatavilla. Salli sijainnin käyttö selaimen asetuksista.');
            }
        });
        return button;
    };

    locateMeButton.addTo(map);
}

// Initialize the map
function initializeMap() {
    map = L.map('map').setView([60.1699, 24.9384], 12); // Default to Helsinki
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    addLocateMeButton();
}

// Plot restaurants on the map
function plotRestaurantsOnMap(restaurants) {
    restaurants.forEach(restaurant => {
        const [longitude, latitude] = restaurant.location.coordinates; // Extract coordinates
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(`<b>${restaurant.name}</b><br>${restaurant.city}<br>${restaurant.company}`); // Add a meaningful popup
    });
}

// Highlight the nearest restaurant
function highlightNearestRestaurant(restaurants) {
    if (!navigator.geolocation) {
        alert('Selaimesi ei tue sijainnin hakemista.');
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        userLocation = [position.coords.latitude, position.coords.longitude];
        const nearest = findNearestRestaurant(userLocation, restaurants);

        if (nearest) {
            // Add a marker for the user's location
            const userMarker = L.marker(userLocation, { icon: L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            }) }).addTo(map);
            userMarker.bindPopup('Sinun sijaintisi').openPopup(); // Add a meaningful popup for the user's location

            // Highlight the nearest restaurant
            const [nearestLongitude, nearestLatitude] = nearest.location.coordinates;
            const nearestMarker = L.marker([nearestLatitude, nearestLongitude], { icon: L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-green.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
            }) }).addTo(map);
            nearestMarker.bindPopup(`<b>Lähin ravintola:</b><br>${nearest.name}`).openPopup();

            // Adjust the map view to include both the user and the nearest restaurant
            const bounds = L.latLngBounds([userLocation, [nearestLatitude, nearestLongitude]]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, error => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert('Sijainnin käyttö estetty. Salli sijainnin käyttö selaimen asetuksista.');
                break;
            case error.POSITION_UNAVAILABLE:
                alert('Sijaintitiedot eivät ole saatavilla.');
                break;
            case error.TIMEOUT:
                alert('Sijainnin hakeminen kesti liian kauan. Yritä uudelleen.');
                break;
            default:
                alert('Sijainnin hakeminen epäonnistui. Yritä uudelleen.');
                console.error('Sijainnin hakeminen epäonnistui:', error);
        }
    });
}

// Find the nearest restaurant
function findNearestRestaurant(location, restaurants) {
    let nearest = null;
    let minDistance = Infinity;

    restaurants.forEach(restaurant => {
        const [longitude, latitude] = restaurant.location.coordinates;
        const distance = Math.sqrt(
            Math.pow(location[0] - latitude, 2) +
            Math.pow(location[1] - longitude, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearest = restaurant;
        }
    });

    return nearest;
}

// Export functions for use in other modules
export { initializeMap, plotRestaurantsOnMap, highlightNearestRestaurant };