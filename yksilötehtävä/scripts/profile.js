document.addEventListener('DOMContentLoaded', () => {
    const profilePicturePreview = document.getElementById('profile-picture-preview');
    const profilePictureInput = document.getElementById('profile-picture');
    const token = localStorage.getItem('token');
    const favoriteRestaurantDropdown = document.getElementById('favorite-restaurant');
    const usernameInput = document.getElementById('username-input');
    const usernameDisplay = document.getElementById('username');
    const updateUsernameButton = document.getElementById('update-username-button');
    const updateFavoriteRestaurantButton = document.getElementById('update-favorite-restaurant-button');

    // Fetch user profile data from the server
    async function fetchUserProfile() {
        if (!token) {
            console.error('Token is missing. Please log in again.');
            alert('Virhe: Kirjaudu sisään uudelleen.');
            return;
        }

        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users/token', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error(`Error fetching user profile: ${response.status} ${response.statusText}`);
                throw new Error('Käyttäjätietojen lataaminen epäonnistui.');
            }

            const userData = await response.json();
            console.log('Fetched user profile:', userData);

            // Save the fetched data to localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));

            // Update UI with fetched data
            loadAvatar();
            loadUsername();
            loadFavoriteRestaurant();
        } catch (error) {
            console.error('Error fetching user profile:', error);
            alert('Virhe käyttäjätietojen lataamisessa.');
        }
    }

    // Load the current avatar (if available)
    function loadAvatar() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.avatar) {
            // Construct the full URL for the avatar
            profilePicturePreview.src = `https://media2.edu.metropolia.fi/uploads/${currentUser.avatar}`;
        } else {
            profilePicturePreview.src = '../public/images/default-avatar.png';
        }
        profilePicturePreview.style.display = 'block';
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
    async function loadFavoriteRestaurant() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const currentFavoriteRestaurant = document.getElementById('current-favorite-restaurant');

        if (currentUser && currentUser.favouriteRestaurant) {
            try {
                const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/${currentUser.favouriteRestaurant}`);
                if (!response.ok) {
                    throw new Error('Suosikkiravintolan tietojen lataaminen epäonnistui.');
                }

                const restaurantData = await response.json();
                currentFavoriteRestaurant.textContent = restaurantData.name;
            } catch (error) {
                console.error('Error fetching favorite restaurant details:', error);
                currentFavoriteRestaurant.textContent = 'Ei valittua suosikkiravintolaa';
            }
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
                console.error('Avatar upload failed:', errorData);
                throw new Error(errorData.error || 'Profiilikuvan lataaminen epäonnistui.');
            }

            const data = await response.json();
            console.log('Avatar upload response:', data);

            alert('Profiilikuvasi on päivitetty onnistuneesti.');

            // Update the avatar preview
            if (data.data && data.data.avatar) {
                profilePicturePreview.src = `https://media2.edu.metropolia.fi/uploads/${data.data.avatar}`;

                // Update localStorage with the new avatar
                const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                currentUser.avatar = data.data.avatar;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                console.error('Avatar URL missing in response.');
                alert('Virhe: Profiilikuvan URL puuttuu.');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
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

    // Check if the username is available
    async function isUsernameAvailable(username) {
        try {
            const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/users/available/${username}`);
            if (!response.ok) {
                throw new Error('Käyttäjänimen tarkistaminen epäonnistui.');
            }
            const data = await response.json();
            return data.available;
        } catch (error) {
            console.error('Error checking username availability:', error);
            alert('Virhe käyttäjänimen tarkistamisessa.');
            return false;
        }
    }

    // Update the user's username
    updateUsernameButton.addEventListener('click', async () => {
        const updatedUsername = usernameInput.value.trim();

        if (!updatedUsername) {
            alert('Syötä käyttäjänimi ennen päivittämistä.');
            return;
        }

        // Check if the username is available
        const usernameAvailable = await isUsernameAvailable(updatedUsername);
        if (!usernameAvailable) {
            alert('Käyttäjänimi on jo varattu. Valitse toinen käyttäjänimi.');
            return;
        }

        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username: updatedUsername })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Username update failed:', errorData);
                throw new Error(errorData.message || 'Käyttäjänimen päivittäminen epäonnistui.');
            }

            const responseData = await response.json();
            console.log('Username update response:', responseData);

            // Update the local storage and UI with the new username
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            currentUser.username = updatedUsername;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            usernameDisplay.textContent = updatedUsername;
            alert('Käyttäjänimesi on päivitetty onnistuneesti.');
        } catch (error) {
            console.error('Error updating username:', error);
            alert(`Virhe: ${error.message}`);
        }
    });

    // Update the user's favorite restaurant
    updateFavoriteRestaurantButton.addEventListener('click', async () => {
        const selectedRestaurantId = favoriteRestaurantDropdown.value;
        const selectedRestaurantName = favoriteRestaurantDropdown.options[favoriteRestaurantDropdown.selectedIndex]?.text;

        if (!selectedRestaurantId) {
            alert('Valitse suosikkiravintola ennen päivittämistä.');
            return;
        }

        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ favouriteRestaurant: selectedRestaurantId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Favorite restaurant update failed:', errorData);
                throw new Error(errorData.message || 'Suosikkiravintolan päivittäminen epäonnistui.');
            }

            const responseData = await response.json();
            console.log('Favorite restaurant update response:', responseData);

            // Update the local storage and UI with the new favorite restaurant
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            currentUser.favouriteRestaurantName = selectedRestaurantName;
            currentUser.favouriteRestaurant = selectedRestaurantId; // Save the ID as well
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            document.getElementById('current-favorite-restaurant').textContent = selectedRestaurantName;
            alert('Suosikkiravintolasi on päivitetty onnistuneesti.');
        } catch (error) {
            console.error('Error updating favorite restaurant:', error);
            alert(`Virhe: ${error.message}`);
        }
    });

    // Load the avatar, username, favorite restaurant, and populate restaurants on page load
    fetchUserProfile();
    populateRestaurants();
});