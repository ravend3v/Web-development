document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Hash a password using the crypto.subtle API
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    // Handle login
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const hashedPassword = await hashPassword(password);

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username && user.password === hashedPassword);

        // If user is found login
        if (user) {
            Swal.fire({
                icon: 'success',
                title: 'Kirjautuminen onnistui!',
                text: 'Tervetuloa takaisin!',
                confirmButtonText: 'Jatka'
            }).then(() => {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = '../index.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Virheellinen käyttäjänimi tai salasana',
                text: 'Yritä uudelleen.',
                confirmButtonText: 'OK'
            });
        }
    });
});