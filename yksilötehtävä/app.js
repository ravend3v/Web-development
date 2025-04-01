document.addEventListener('DOMContentLoaded', () => {

    // DOM elements for restaurant list, filters, and user actions
    const restaurantList = document.getElementById('restaurants');
    const cityFilter = document.getElementById('city-filter');
    const providerFilter = document.getElementById('provider-filter');
    const applyFiltersButton = document.getElementById('apply-filters');

    // DOM elements and localStorage for user authentication and actions
    const userActions = document.getElementById('user-actions');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    /**
     * Render user action buttons (login, logout, profile) based on authentication state.
     */
    function renderUserActions() {
        userActions.innerHTML = ''; // Clear existing buttons

        if (isLoggedIn && currentUser) {
            // Profile Page Button
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
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
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

    let restaurants = []; // Array to hold restaurant data fetched from the API

    // Initialize the map using Leaflet.js, centered on Helsinki, Finland
    const map = L.map('map').setView([60.1699, 24.9384], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markers = L.layerGroup().addTo(map); // Layer group to manage map markers

    /**
     * Fetch restaurant data from the API and handle the response.
     */
    function fetchRestaurants() {
        fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Virhe haettaessa ravintoloita: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Handle different API response structures
                if (Array.isArray(data)) {
                    restaurants = data; // Use the array directly
                } else if (data.restaurants && Array.isArray(data.restaurants)) {
                    restaurants = data.restaurants; // Use the nested array
                } else {
                    throw new Error('Virheellinen API-vastaus: odotettiin ravintolalistaa.');
                }

                displayRestaurants(restaurants); // Display restaurants in the list
                displayMarkers(restaurants); // Display markers on the map
            })
            .catch(error => console.error(error.message));
    }

    /**
     * Display the list of restaurants in the DOM.
     * @param {Array} restaurants - Array of restaurant objects.
     */
    function displayRestaurants(restaurants) {
        restaurantList.innerHTML = ''; // Clear existing list
        restaurants.forEach(restaurant => {
            const li = document.createElement('li');
            li.textContent = `${restaurant.name} (${restaurant.city}, ${restaurant.company})`;
            restaurantList.appendChild(li);
        });
    }

    /**
     * Display markers for restaurants on the map.
     * @param {Array} restaurants - Array of restaurant objects.
     */
    function displayMarkers(restaurants) {
        markers.clearLayers(); // Clear existing markers
        restaurants.forEach(restaurant => {
            if (restaurant.location && restaurant.location.coordinates) {
                const [longitude, latitude] = restaurant.location.coordinates; // Extract coordinates
                const marker = L.marker([latitude, longitude])
                    .bindPopup(`<b>${restaurant.name}</b><br>${restaurant.city}, ${restaurant.company}`);
                markers.addLayer(marker);
            }
        });
    }

    /**
     * Filter restaurants based on user input from city and provider filters.
     */
    function filterRestaurants() {
        const city = cityFilter.value.toLowerCase();
        const provider = providerFilter.value.toLowerCase();

        const filteredRestaurants = restaurants.filter(restaurant => {
            return (
                (!city || restaurant.city.toLowerCase().includes(city)) &&
                (!provider || restaurant.company.toLowerCase().includes(provider))
            );
        });

        displayRestaurants(filteredRestaurants); // Update the restaurant list
        displayMarkers(filteredRestaurants); // Update the map markers
    }

    // Event listener for the "Apply Filters" button
    applyFiltersButton.addEventListener('click', filterRestaurants);

    // Initialize the app by fetching restaurant data
    fetchRestaurants();
});