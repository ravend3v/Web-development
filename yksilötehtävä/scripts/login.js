document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

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
            throw new Error(errorData.message || 'Kirjautuminen epäonnistui.');
        }

        const responseData = await response.json();
        const { token, data } = responseData;

        localStorage.setItem('token', token);

        // Save user data, including favorite restaurant name, in localStorage
        const currentUser = {
            username: data.username,
            favouriteRestaurantName: data.favouriteRestaurant || 'Ei valittua suosikkiravintolaa'
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert('Kirjautuminen onnistui!');
        location.href = '/';
    } catch (error) {
        console.error('Error logging in:', error);
        alert(`Virhe: ${error.message}`);
    }
}