let map; 

// Initializes the map with a default view and tile layer
export function initializeMap() {
    map = L.map('map').setView([60.1699, 24.9384], 13); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Plots a list of restaurants on the map using their coordinates
export function plotRestaurantsOnMap(restaurants) {
    restaurants.forEach(restaurant => {
        const [longitude, latitude] = restaurant.location.coordinates;
        const marker = L.marker([latitude, longitude]).addTo(map);
        marker.bindPopup(`<b>${restaurant.name}</b><br>${restaurant.city}<br>${restaurant.company}`);
    });
}

// Highlights the nearest restaurant to the user's current location
export function highlightNearestRestaurant(restaurants) {
    if (!navigator.geolocation) {
        alert('Selaimesi ei tue sijainnin hakemista.');
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const userLocation = [position.coords.latitude, position.coords.longitude];
        const nearest = findNearestRestaurant(userLocation, restaurants);

        if (nearest) {
            const [nearestLongitude, nearestLatitude] = nearest.location.coordinates;
            const nearestMarker = L.marker([nearestLatitude, nearestLongitude]).addTo(map);
            nearestMarker.bindPopup(`<b>Lähin ravintola:</b><br>${nearest.name}`).openPopup();
            nearestMarker._icon.classList.add('huechange');
            map.setView([nearestLatitude, nearestLongitude], 14);
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

// Finds the nearest restaurant to a given location using Euclidean distance
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
