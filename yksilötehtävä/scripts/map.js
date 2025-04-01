let map; // Map instance
let userLocation = null;

// Initialize the map
function initializeMap() {
    map = L.map('map').setView([60.1699, 24.9384], 12); // Default to Helsinki
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

// Plot restaurants on the map
function plotRestaurantsOnMap(restaurants) {
    restaurants.forEach(restaurant => {
        const [longitude, latitude] = restaurant.location.coordinates; // Extract coordinates
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(`<b>${restaurant.name}</b><br>${restaurant.city}<br>${restaurant.company}`);
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
            const userMarker = L.marker(userLocation, { color: 'red' }).addTo(map);
            userMarker.bindPopup('Sinun sijaintisi').openPopup();

            const [nearestLongitude, nearestLatitude] = nearest.location.coordinates;
            const nearestMarker = L.marker([nearestLatitude, nearestLongitude], { color: 'green' }).addTo(map);
            nearestMarker.bindPopup(`<b>Lähin ravintola:</b><br>${nearest.name}`).openPopup();

            map.setView(userLocation, 14);
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