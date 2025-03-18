const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const fs = require('fs');

// Ask user to enter a number and with a for loop, write all the natural numbers from 1 to the number entered by the user to a file called naturalNum.txt
readline.question('Enter a number: ', num => {
    // Check if the input is a number
    if (isNaN(num)) {
        console.log('Please enter a number!');
        readline.close();
        return;
    }

    // For loop to sum all the natural numbers from 1 to the number entered by the user
    let sum = 0;
    for (let i = 1; i <= num; i++) {
        sum += i;
    }
    
    // Object to save the result to a file
    const result = {
        number: num,
        sum: sum
    }

    // Write the result to a json file
    fs.writeFileSync('naturalResults.json', JSON.stringify(result, null, 2));
    console.log('Result has been saved to naturalNum.json');

    readline.close();
});
