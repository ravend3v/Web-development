// Reusable async function to handle Fetch API requests
async function fetchData(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json(); // Return the response as JSON
    } catch (error) {
        console.error('Error in fetchData:', error);
        throw error; // Re-throw the error for further handling
    }
}

// Testing the fetchData function
(async () => {
    try {
        const user = {
            name: 'Matti Meikalainen',
            job: 'Developer'
        };
        const url = 'https://reqres.in/api/users';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        };

        const userData = await fetchData(url, options);
        console.log(userData); // Log the response data
    } catch (error) {
        console.error('An error occurred:', error); // Handle any errors
    }
})();