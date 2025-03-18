// Temperature conversion

// Prompt the user to enter the temperature in Celsius
let celsius = prompt("Enter the temperature in Celsius: ");

// Validate the input
if (isNaN(celsius)) {
    console.log("Invalid input. Please enter a number.");
} else {
    // Convert the temperature to fahrenheit and kelvin
    let fahrenheit = celsiusToFahrenheit(celsius);
    let kelvin = celsiusToKelvin(celsius);

    // Display the results
    console.log(`${celsius}°C is equal to ${fahrenheit}°F and ${kelvin}K`);
}

// Function to convert from Celsius to fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Function to convert celsius to Kelvin
function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}


// add to page
document.getElementById("result").innerHTML = `${celsius}°C is equal to ${fahrenheit}°F and ${kelvin}K`;


