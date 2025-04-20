document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Handle login form submission
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        await loginUser({ username, password });
    });
});

async function loginUser(credentials) {
    try {
        const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed.');
        }

        const responseData = await response.json();
        const { token, data } = responseData;

        // Store authentication token in localStorage
        localStorage.setItem('token', token);

        // Save user details in localStorage
        const currentUser = {
            username: data.username,
            favouriteRestaurantName: data.favouriteRestaurant || 'No favorite restaurant selected'
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert('Login successful!');
        location.href = '/~eliasoj/web-ohjelmointi/yksilotehtava/';
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}