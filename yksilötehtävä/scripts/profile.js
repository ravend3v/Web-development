document.addEventListener('DOMContentLoaded', () => {
    const profilePicturePreview = document.getElementById('profile-picture-preview');
    const profilePictureInput = document.getElementById('profile-picture');
    const token = localStorage.getItem('token');
    const favoriteRestaurantDropdown = document.getElementById('favorite-restaurant');
    const updateProfileButton = document.getElementById('update-profile-button');
    const usernameInput = document.getElementById('username-input');
    const usernameDisplay = document.getElementById('username');

    // Load the current avatar (if available)
    function loadAvatar() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.avatar) {
            profilePicturePreview.src = `https://media2.edu.metropolia.fi/uploads/${currentUser.avatar}`;
            profilePicturePreview.style.display = 'block';
        } else {
            profilePicturePreview.src = '../public/images/default-avatar.png';
            profilePicturePreview.style.display = 'block';
        }
    }

    // Load the current username (if available)
    function loadUsername() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.username) {
            usernameDisplay.textContent = currentUser.username;
            usernameInput.value = currentUser.username;
        } else {
            usernameDisplay.textContent = 'Ei käyttäjänimeä';
        }
    }

    // Load the current favorite restaurant (if available)
    function loadFavoriteRestaurant() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const currentFavoriteRestaurant = document.getElementById('current-favorite-restaurant');
        if (currentUser && currentUser.favouriteRestaurantName) {
            currentFavoriteRestaurant.textContent = currentUser.favouriteRestaurantName;
        } else {
            currentFavoriteRestaurant.textContent = 'Ei valittua suosikkiravintolaa';
        }
    }

    // Trigger file input when the image is clicked
    profilePicturePreview.addEventListener('click', () => {
        profilePictureInput.click();
    });

    // Handle avatar upload
    profilePictureInput.addEventListener('change', async (event) => {
        const avatarFile = event.target.files[0];

        if (!avatarFile) {
            alert('Valitse profiilikuva ennen lähettämistä.');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users/avatar', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Profiilikuvan lataaminen epäonnistui.');
            }

            const data = await response.json();
            alert('Profiilikuvasi on päivitetty onnistuneesti.');

            // Update the avatar preview
            profilePicturePreview.src = `https://media2.edu.metropolia.fi/uploads/${data.data.avatar}`;
        } catch (error) {
            alert(`Virhe: ${error.message}`);
        }
    });

    // Fetch and populate the restaurant list
    async function populateRestaurants() {
        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants');
            if (!response.ok) {
                throw new Error('Ravintoloiden lataaminen epäonnistui.');
            }
            const restaurants = await response.json();
            restaurants.forEach(restaurant => {
                const option = document.createElement('option');
                option.value = restaurant._id;
                option.textContent = restaurant.name;
                favoriteRestaurantDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            alert('Virhe ravintoloiden lataamisessa.');
        }
    }

    // Update the user's profile (username and favorite restaurant)
    updateProfileButton.addEventListener('click', async () => {
        const selectedRestaurantId = favoriteRestaurantDropdown.value;
        const selectedRestaurantName = favoriteRestaurantDropdown.options[favoriteRestaurantDropdown.selectedIndex]?.text;
        const updatedUsername = usernameInput.value.trim();

        if (!selectedRestaurantId || !updatedUsername) {
            alert('Täytä käyttäjänimi ja valitse suosikkiravintola ennen päivittämistä.');
            return;
        }

        const updatedData = {
            username: updatedUsername,
            favouriteRestaurant: selectedRestaurantId
        };

        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Tietojen päivittäminen epäonnistui.');
            }

            // Update the local storage and UI with the new data
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            currentUser.username = updatedUsername;
            currentUser.favouriteRestaurantName = selectedRestaurantName;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            usernameDisplay.textContent = updatedUsername;
            document.getElementById('current-favorite-restaurant').textContent = selectedRestaurantName;

            alert('Profiilisi on päivitetty onnistuneesti.');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Virhe: ${error.message}`);
        }
    });

    // Load the avatar, username, favorite restaurant, and populate restaurants on page load
    loadAvatar();
    loadUsername();
    loadFavoriteRestaurant();
    populateRestaurants();
});