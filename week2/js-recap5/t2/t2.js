// Function to create a new user using Reqres API
async function createUser() {
    const userData = {
        name: 'John Doe',
        job: 'Software Developer'
    };

    try {
        const response = await fetch('https://reqres.in/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Log the response data to the console
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

// Call the function
createUser();