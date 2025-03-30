// Function to fetch user data from Reqres API
async function fetchUserData() {
    try {
        const response = await fetch('https://reqres.in/api/users/1');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // Log the response data to the console
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Call the function
fetchUserData();