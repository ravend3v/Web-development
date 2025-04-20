document.addEventListener('DOMContentLoaded', () => {
    const profilePicturePreview = document.getElementById('profile-picture-preview');
    const profilePictureInput = document.getElementById('profile-picture');
    const token = localStorage.getItem('token');

    // Load the current avatar (if available)
    function loadAvatar() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.avatar) {
            profilePicturePreview.src = `https://media2.edu.metropolia.fi/uploads/${currentUser.avatar}`;
            profilePicturePreview.style.display = 'block';
        } else {
            profilePicturePreview.src = '../public/images/default-avatar.png'; // Default avatar
            profilePicturePreview.style.display = 'block';
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
            console.error('Error uploading avatar:', error); // Debugging
            alert(`Virhe: ${error.message}`);
        }
    });

    // Load the avatar on page load
    loadAvatar();
});