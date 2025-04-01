document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    // Hash a password using the crypto.subtle API
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    }

    // Handle registration
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const newPassword = document.getElementById('new-password').value;
        const hashedPassword = await hashPassword(newPassword);

        const users = JSON.parse(localStorage.getItem('users')) || [];

        // If user is already registered notify the user
        if (users.find(user => user.username === newUsername)) {
            Swal.fire({
            icon: 'error',
            title: 'Rekisteröityminen epäonnistui',
            text: 'Käyttäjä on jo olemassa',
            confirmButtonText: 'Yritä uudelleen'
            });
        } else {
            const newUser = { username: newUsername, password: hashedPassword };
            
            Swal.fire({
                icon: 'success',
                title: 'Rekisteröityminen onnistui!',
                confirmButtonText: 'Jatka'
            }).then(() => {
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                window.location.href = '../index.html';
            })
        }
    });
});