import { loadTranslations } from "./language.js";

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

    // Populate the city and provider filters
    function populateFilterOptions(restaurants) {
        const cityFilter = document.getElementById('city-filter');
        const providerFilter = document.getElementById('provider-filter');
    
        // Clear existing options
        cityFilter.innerHTML = '';
        providerFilter.innerHTML = '';
    
        // Add "All" option to both dropdowns
        const allCityOption = document.createElement('option');
        allCityOption.value = '';
        allCityOption.setAttribute('data-translate', 'all-cities');
        allCityOption.textContent = 'Kaikki';
        cityFilter.appendChild(allCityOption);
    
        const allProviderOption = document.createElement('option');
        allProviderOption.value = '';
        allProviderOption.setAttribute('data-translate', 'all-providers');
        allProviderOption.textContent = 'Kaikki';
        providerFilter.appendChild(allProviderOption);
    
        // Extract unique cities and providers
        const cities = [...new Set(restaurants.map(restaurant => restaurant.city))];
        const providers = [...new Set(restaurants.map(restaurant => restaurant.company))];
    
        // Populate city dropdown
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.toLowerCase();
            option.textContent = city;
            cityFilter.appendChild(option);
        });
    
        // Populate provider dropdown
        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.toLowerCase();
            option.textContent = provider;
            providerFilter.appendChild(option);
        });
    
        // Reapply translations after adding options
        const defaultLanguage = localStorage.getItem('language') || 'en';
        loadTranslations(defaultLanguage);
    }

    // Fetch restaurants from the API
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
                populateFilterOptions(restaurants);
            })
            .catch(error => console.error(error.message));
    }

    function displayRestaurants(restaurants) {
        restaurantList.innerHTML = '';
        restaurants.forEach(restaurant => {
            const li = document.createElement('li');
            li.textContent = `${restaurant.name} (${restaurant.city}, ${restaurant.company})`;
            restaurantList.appendChild(li);
        });
    }

    function displayMarkers(restaurants) {
        markers.clearLayers();
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
            (city === '' || restaurant.city.toLowerCase() === city) &&
            (provider === '' || restaurant.company.toLowerCase() === provider)
        );

        displayRestaurants(filteredRestaurants);
        displayMarkers(filteredRestaurants);
    }

    applyFiltersButton.addEventListener('click', filterRestaurants);
    fetchRestaurants();
});