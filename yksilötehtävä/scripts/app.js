import { loadTranslations } from "./language.js";
import { initializeMap, plotRestaurantsOnMap, highlightNearestRestaurant } from "./map.js";

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
    initializeMap();

    // DOM elements
    const restaurantList = document.getElementById('restaurants');
    const cityFilter = document.getElementById('city-filter');
    const providerFilter = document.getElementById('provider-filter');
    const applyFiltersButton = document.getElementById('apply-filters');
    const userActions = document.getElementById('user-actions');
    const searchInput = document.getElementById('restaurant-search-input');
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Render user actions (login/logout/profile buttons)
    async function renderUserActions() {
        userActions.innerHTML = '';

        const language = localStorage.getItem('language') || 'en';
        const translations = await loadTranslations(language);

        if (token && currentUser) {
            const profileButton = document.createElement('button');
            profileButton.textContent = `${translations['profile'] || 'Profiili'} (${currentUser.username})`;
            profileButton.addEventListener('click', () => {
                window.location.href = 'templates/profile.html';
            });

            const logoutButton = document.createElement('button');
            logoutButton.textContent = translations['logout'] || 'Kirjaudu ulos';
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isLoggedIn');
                window.location.reload();
            });

            userActions.appendChild(profileButton);
            userActions.appendChild(logoutButton);
        } else {
            const loginButton = document.createElement('button');
            loginButton.textContent = translations['login'] || 'Kirjaudu sisään';
            loginButton.addEventListener('click', () => {
                window.location.href = 'templates/login.html';
            });

            userActions.appendChild(loginButton);
        }
    }

    renderUserActions();

    let restaurants = [];

    // Populate city and provider filter dropdowns
    async function populateFilterOptions(restaurants) {
        cityFilter.innerHTML = '';
        providerFilter.innerHTML = '';

        try {
            const language = localStorage.getItem('language') || 'en';
            const translations = await loadTranslations(language);
            const allCitiesText = translations['all-cities'] || 'All Cities';
            const allProvidersText = translations['all-providers'] || 'All Providers';

            const allCityOption = document.createElement('option');
            allCityOption.value = '';
            allCityOption.textContent = allCitiesText;
            cityFilter.appendChild(allCityOption);

            const allProviderOption = document.createElement('option');
            allProviderOption.value = '';
            allProviderOption.textContent = allProvidersText;
            providerFilter.appendChild(allProviderOption);

            const cities = [...new Set(restaurants.map(restaurant => restaurant.city))];
            const providers = [...new Set(restaurants.map(restaurant => restaurant.company))];

            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.toLowerCase();
                option.textContent = city;
                cityFilter.appendChild(option);
            });

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

    // Fetch restaurant data from the API
    async function fetchRestaurants() {
        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants');
            if (!response.ok) throw new Error('Virhe haettaessa ravintoloita: ' + response.statusText);
            const data = await response.json();

            restaurants = Array.isArray(data) ? data : data.restaurants || [];
            displayRestaurants(restaurants);
            plotRestaurantsOnMap(restaurants);
            await populateFilterOptions(restaurants);
        } catch (error) {
            console.error(error.message);
        }
    }

    // Display restaurants in the list
    function displayRestaurants(restaurants) {
        restaurantList.innerHTML = '';
        const language = localStorage.getItem('language') || 'en';

        loadTranslations(language).then(translations => {
            restaurants.forEach(restaurant => {
                const li = document.createElement('li');
                li.textContent = `${restaurant.name} (${restaurant.city}, ${restaurant.company})`;

                const dailyMenuButton = document.createElement('button');
                dailyMenuButton.textContent = translations['daily-menu'] || 'Daily Menu';
                dailyMenuButton.addEventListener('click', () => fetchMenu(restaurant._id, 'daily'));

                const weeklyMenuButton = document.createElement('button');
                weeklyMenuButton.textContent = translations['weekly-menu'] || 'Weekly Menu';
                weeklyMenuButton.addEventListener('click', () => fetchMenu(restaurant._id, 'weekly'));

                li.appendChild(dailyMenuButton);
                li.appendChild(weeklyMenuButton);
                restaurantList.appendChild(li);
            });
        }).catch(error => {
            console.error('Translation error:', error);
        });
    }

    const API_BASE_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants';

    // Fetch menu data (daily or weekly) for a specific restaurant
    async function fetchMenu(restaurantId, type) {
        const language = localStorage.getItem('language') || 'en';
        const endpoint = type === 'daily'
            ? `${API_BASE_URL}/daily/${restaurantId}/${language}`
            : `${API_BASE_URL}/weekly/${restaurantId}/${language}`;

        try {
            const response = await fetch(endpoint);

            if (!response.ok) {
                if (response.status === 404) {
                    displayErrorMessage(`Menu not found for the selected restaurant (ID: ${restaurantId}).`);
                } else {
                    displayErrorMessage(`Failed to fetch menu. Status Code: ${response.status}`);
                }
                return;
            }

            const data = await response.json();

            if (type === 'daily' && data.courses.length === 1 && data.courses[0].name.toLowerCase().includes('closed')) {
                displayErrorMessage(data.courses[0].name);
                return;
            }

            displayMenu(data, type);
        } catch {
            displayErrorMessage('An unexpected error occurred while fetching the menu.');
        }
    }

    // Display menu data in a modal
    function displayMenu(menuData, type) {
        const menuModal = document.getElementById('menu-modal');
        const menuContent = document.getElementById('menu-content');
        menuContent.innerHTML = '';

        if (type === 'daily') {
            if (menuData.courses && menuData.courses.length > 0) {
                menuData.courses.forEach(course => {
                    const courseElement = document.createElement('div');
                    courseElement.textContent = `${course.name} - ${course.price} (${course.diets})`;
                    menuContent.appendChild(courseElement);
                });
            } else {
                menuContent.innerHTML = '<p>No courses available for today.</p>';
            }
        } else if (type === 'weekly') {
            if (menuData.days && menuData.days.length > 0) {
                menuData.days.forEach(day => {
                    const dayElement = document.createElement('div');
                    dayElement.innerHTML = `<strong>${day.date}</strong>`;
                    day.courses.forEach(course => {
                        const courseElement = document.createElement('div');
                        courseElement.textContent = `${course.name} - ${course.price} (${course.diets})`;
                        dayElement.appendChild(courseElement);
                    });
                    menuContent.appendChild(dayElement);
                });
            } else {
                menuContent.innerHTML = '<p>No weekly menu available.</p>';
            }
        }

        menuModal.classList.remove('hidden');
        document.getElementById('map').style.pointerEvents = 'none';
    }

    // Display error messages in the modal
    function displayErrorMessage(message) {
        const menuModal = document.getElementById('menu-modal');
        const menuContent = document.getElementById('menu-content');
        menuContent.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
        menuModal.classList.remove('hidden');
        document.getElementById('map').style.pointerEvents = 'none';
    }

    document.getElementById('close-menu-modal').addEventListener('click', () => {
        document.getElementById('menu-modal').classList.add('hidden');
        document.getElementById('map').style.pointerEvents = 'auto';
    });

    // Filter restaurants based on city and provider
    function filterRestaurants() {
        const city = cityFilter.value.toLowerCase();
        const provider = providerFilter.value.toLowerCase();

        const filteredRestaurants = restaurants.filter(restaurant =>
            (city === '' || restaurant.city.toLowerCase() === city) &&
            (provider === '' || restaurant.company.toLowerCase() === provider)
        );

        displayRestaurants(filteredRestaurants);
        plotRestaurantsOnMap(filteredRestaurants);
    }

    // Search restaurants by name, city, or provider
    function searchRestaurants() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredRestaurants = restaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchTerm) ||
            restaurant.city.toLowerCase().includes(searchTerm) ||
            restaurant.company.toLowerCase().includes(searchTerm)
        );

        displayRestaurants(filteredRestaurants);
        plotRestaurantsOnMap(filteredRestaurants);
    }

    applyFiltersButton.addEventListener('click', filterRestaurants);
    searchInput.addEventListener('input', searchRestaurants);

    // Update translations when the language changes
    document.getElementById('language-selector').addEventListener('change', async (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('language', selectedLanguage);
        await renderUserActions(); // Re-render user actions with updated translations
        displayRestaurants(restaurants); // Re-render restaurants with updated translations
        populateFilterOptions(restaurants); // Update filter options with new translations
    });

    // Fetch restaurants and highlight the nearest one
    fetchRestaurants().then(() => {
        highlightNearestRestaurant(restaurants);
    });
});
