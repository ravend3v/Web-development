document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kirjautuminen epäonnistui.');
            }

            const data = await response.json();
            console.log('Login successful:', data); // Debugging

            // Save the token, user data, and isLoggedIn flag in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.data));
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect to the index.html page
            alert(`Kirjautuminen onnistui! Tervetuloa takaisin, ${data.data.username}!`);
            window.location.href = '../index.html';
        } catch (error) {
            console.error('Error during login:', error); // Debugging
            alert(`Virhe: ${error.message}`);
        }
    });
});