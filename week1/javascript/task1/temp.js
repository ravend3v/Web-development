// Temperature conversion


// Function to convert from Celsius to fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Function to convert celsius to Kelvin
function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Enter the temperature in Celsius: ', celsius => {
    const fahrenheit = celsiusToFahrenheit(celsius);
    const kelvin = celsiusToKelvin(celsius);

    // Create an object to store the results
    const results = {
        celsius: celsius,
        fahrenheit: fahrenheit,
        kelvin: kelvin
    };
    
    // Save the results to a JSON file
    const fs = require('fs');
    fs.writeFile('results.json', JSON.stringify(results, null, 2), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Results saved to results.json');
    });

    readline.close();
});

