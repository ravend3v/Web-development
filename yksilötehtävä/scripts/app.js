import { loadTranslations } from "./language.js";
import { initializeMap, plotRestaurantsOnMap, highlightNearestRestaurant } from "./map.js";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
    initializeMap();

    const restaurantList = document.getElementById('restaurants');
    const cityFilter = document.getElementById('city-filter');
    const providerFilter = document.getElementById('provider-filter');
    const applyFiltersButton = document.getElementById('apply-filters');
    const userActions = document.getElementById('user-actions');
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    function renderUserActions() {
        userActions.innerHTML = '';

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

    // Populate the city and provider filters
    async function populateFilterOptions(restaurants) {
        const cityFilter = document.getElementById('city-filter');
        const providerFilter = document.getElementById('provider-filter');

        // Clear existing options
        cityFilter.innerHTML = '';
        providerFilter.innerHTML = '';

        try {
            // Translate "All" option
            const language = localStorage.getItem('language') || 'en';
            const translations = await loadTranslations(language);
            const allCitiesText = translations['all-cities'] || 'All Cities';
            const allProvidersText = translations['all-providers'] || 'All Providers';

            // Add "All" option to both dropdowns
            const allCityOption = document.createElement('option');
            allCityOption.value = '';
            allCityOption.textContent = allCitiesText;
            cityFilter.appendChild(allCityOption);

            const allProviderOption = document.createElement('option');
            allProviderOption.value = '';
            allProviderOption.textContent = allProvidersText;
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
        } catch (error) {
            console.error('Translation error:', error);
        }
    }

    // Fetch restaurants from the API
    async function fetchRestaurants() {
        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants');
            if (!response.ok) throw new Error('Virhe haettaessa ravintoloita: ' + response.statusText);
            const data = await response.json();

            restaurants = Array.isArray(data) ? data : data.restaurants || [];
            displayRestaurants(restaurants);
            plotRestaurantsOnMap(restaurants); // Use the function to plot restaurants on the map
            await populateFilterOptions(restaurants); // Ensure this completes before proceeding
        } catch (error) {
            console.error(error.message);
        }
    }

    function displayRestaurants(restaurants) {
        restaurantList.innerHTML = '';
        restaurants.forEach(restaurant => {
            const li = document.createElement('li');
            li.textContent = `${restaurant.name} (${restaurant.city}, ${restaurant.company})`;
            restaurantList.appendChild(li);
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
        plotRestaurantsOnMap(filteredRestaurants); // Update the map with filtered restaurants
    }

    applyFiltersButton.addEventListener('click', filterRestaurants);

    // Highlight the nearest restaurant after fetching data
    fetchRestaurants().then(() => {
        highlightNearestRestaurant(restaurants);
    });
});
