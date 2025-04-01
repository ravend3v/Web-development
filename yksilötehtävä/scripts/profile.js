document.addEventListener('DOMContentLoaded', () => {
    const homeButtonContainer = document.getElementById('home-button');

    // Redirect to login if not logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!isLoggedIn || !currentUser) {
        alert('Profiilisivu on käytössä vain sisäänkirjautuneena.');
        window.location.href = 'login.html';
        return;
    }

    // Add Home button dynamically
    const homeButton = document.createElement('button');
    homeButton.textContent = 'Koti';
    homeButton.addEventListener('click', () => {
        window.location.href = '../index.html'; // Redirect to the home page
    });
    homeButtonContainer.appendChild(homeButton);

    // Populate user data (existing logic)
    const usernameField = document.getElementById('username');
    const favoriteRestaurantField = document.getElementById('favorite-restaurant');
    const profilePictureInput = document.getElementById('profile-picture');
    const profilePicturePreview = document.getElementById('profile-picture-preview');
    const profilePictureContainer = document.getElementById('profile-picture-container');
    const updateProfileButton = document.getElementById('update-profile-button');

    usernameField.textContent = currentUser.username;
    favoriteRestaurantField.value = currentUser.favoriteRestaurant || '';

    if (currentUser.profilePicture) {
        profilePicturePreview.src = currentUser.profilePicture;
        profilePicturePreview.style.display = 'block';
    }

    // Handle profile picture click to trigger file input
    profilePictureContainer.addEventListener('click', () => {
        profilePictureInput.click();
    });

    // Handle profile picture upload
    profilePictureInput.addEventListener('change', () => {
        const file = profilePictureInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                profilePicturePreview.src = reader.result;
                profilePicturePreview.style.display = 'block';
                currentUser.profilePicture = reader.result; // Save the image as a base64 string
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle profile updates
    updateProfileButton.addEventListener('click', (event) => {
        event.preventDefault();

        const favoriteRestaurant = favoriteRestaurantField.value;

        currentUser.favoriteRestaurant = favoriteRestaurant;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Show success notification using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Profiili päivitetty',
                text: 'Profiilisi tiedot on tallennettu onnistuneesti!',
                confirmButtonText: 'OK'
            });
        } else {
            // Show error notification using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Virhe',
                text: 'Käyttäjää ei löytynyt!',
                confirmButtonText: 'OK'
            });
        }
    });
});