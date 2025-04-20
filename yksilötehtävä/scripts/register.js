document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('new-username').value;
        const email = document.getElementById('new-email').value;
        const password = document.getElementById('new-password').value;

        try {
            const usernameCheckResponse = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/users/available/${username}`);
            const usernameCheckData = await usernameCheckResponse.json();

            if (!usernameCheckData.available) {
                throw new Error('Käyttäjänimi on jo varattu.');
            }

            const response = await fetch('https://media2.edu.metropolia.fi/restaurant/api/v1/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Rekisteröinti epäonnistui.');
            }

            const data = await response.json();
            alert(`Rekisteröinti onnistui! Tervetuloa, ${data.data.username}! Aktivoi tilisi sähköpostilinkin kautta.`);
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error during registration:', error); // Debugging
            alert(`Virhe: ${error.message}`);
        }
    });
});