function logoutUser() {
    localStorage.removeItem('token'); // Remove only the token
    alert('Olet kirjautunut ulos.');
    location.href = '/login.html'; // Redirect to login page
}

export { logoutUser };