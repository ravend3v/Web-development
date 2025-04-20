document.addEventListener('DOMContentLoaded', () => {
    const restaurantList = document.getElementById('restaurants');
    const cityFilter = document.getElementById('city-filter');
    const providerFilter = document.getElementById('provider-filter');
    const applyFiltersButton = document.getElementById('apply-filters');
    const userActions = document.getElementById('user-actions');
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    function renderUserActions() {
        userActions.innerHTML = ''; // Clear existing buttons

        if (token && currentUser) {
            // Profile Button
            const profileButton = document.createElement('button');
            profileButton.textContent = `Profiilisivu (${currentUser.username})`;
            profileButton.addEventListener('click', () => {
                window.location.href = 'templates/profile.html';
            });
            userActions.appendChild(profileButton);

            // Logout Button
            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Kirjaudu ulos';
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isLoggedIn');
                window.location.reload();
            });
            userActions.appendChild(logoutButton);
        } else {
            // Login Button
            const loginButton = document.createElement('button');
            loginButton.textContent = 'Kirjaudu sisään';
            loginButton.addEventListener('click', () => {
                window.location.href = 'templates/login.html';
            });
            userActions.appendChild(loginButton);
        }
    }

    renderUserActions();

    let restaurants = [];
    const map = L.map('map').setView([60.1699, 24.9384], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    const markers = L.layerGroup().addTo(map);

    function fetchRestaurants() {
        fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants')
            .then(response => {
                if (!response.ok) throw new Error('Virhe haettaessa ravintoloita: ' + response.statusText);
                return response.json();
            })
            .then(data => {
                restaurants = Array.isArray(data) ? data : data.restaurants || [];
                displayRestaurants(restaurants);
                displayMarkers(restaurants);
            })
            .catch(error => console.error(error.message));
    }

    function displayRestaurants(restaurants) {
        restaurantList.innerHTML = ''; // Clear existing list
        restaurants.forEach(restaurant => {
            const li = document.createElement('li');
            li.textContent = `${restaurant.name} (${restaurant.city}, ${restaurant.company})`;
            restaurantList.appendChild(li);
        });
    }

    function displayMarkers(restaurants) {
        markers.clearLayers(); // Clear existing markers
        restaurants.forEach(restaurant => {
            if (restaurant.location?.coordinates) {
                const [longitude, latitude] = restaurant.location.coordinates;
                const marker = L.marker([latitude, longitude])
                    .bindPopup(`<b>${restaurant.name}</b><br>${restaurant.city}, ${restaurant.company}`);
                markers.addLayer(marker);
            }
        });
    }

    function filterRestaurants() {
        const city = cityFilter.value.toLowerCase();
        const provider = providerFilter.value.toLowerCase();

        const filteredRestaurants = restaurants.filter(restaurant =>
            (!city || restaurant.city.toLowerCase().includes(city)) &&
            (!provider || restaurant.company.toLowerCase().includes(provider))
        );

        displayRestaurants(filteredRestaurants);
        displayMarkers(filteredRestaurants);
    }

    applyFiltersButton.addEventListener('click', filterRestaurants);
    fetchRestaurants();
});