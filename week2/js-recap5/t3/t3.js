// Function to handle GET request to a non-existent URL
async function fetchNonExistentResource() {
    try {
        const response = await fetch('https://reqres.in/api/unknown/23');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching non-existent resource:', error);
    }
}

// Function to handle POST request to a non-existent URL
async function postNonExistentResource() {
    try {
        const response = await fetch('https://reqres.in/api/unknown/23', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Test', job: 'Tester' })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error posting to non-existent resource:', error);
    }
}

// Function to handle PUT request to a non-existent URL
async function putNonExistentResource() {
    try {
        const response = await fetch('https://reqres.in/api/unknown/23', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Updated Name', job: 'Updated Job' })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error putting to non-existent resource:', error);
    }
}

// Function to handle DELETE request to a non-existent URL
async function deleteNonExistentResource() {
    try {
        const response = await fetch('https://reqres.in/api/unknown/23', {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Resource deleted successfully');
    } catch (error) {
        console.error('Error deleting non-existent resource:', error);
    }
}

// Call the functions
fetchNonExistentResource();
postNonExistentResource();
putNonExistentResource();
deleteNonExistentResource();