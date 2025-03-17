const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const fs = require('fs');

// Ask the user to enter the sides of the triangle
readline.question('Enter the sides of the triangle (comma separated): ', sides => {
    const sidesArray = sides.split(',').map(side => parseFloat(side));
    const [a, b, c] = sidesArray;
    
    // Check what type of triangle it is
    // Equilateral triangle
    if (a === b && b === c) {
        console.log('Equilateral triangle');
    }

    // Isosceles triangle
    else if (a === b || a === c || b === c) {
        console.log('Isosceles triangle');
    }

    // Scalene triangle
    else {
        console.log('Scalene triangle');
    }

    // Save the results to a JSON file with the sides and the type of triangle
    const results = {
        sides: sidesArray,
        type: a === b && b === c ? 'Equilateral' : a === b || a === c || b === c ? 'Isosceles' : 'Scalene'
    };

    fs.writeFile('triangleResults.json', JSON.stringify(results, null, 2), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Results saved to triangleResults.json');
    });

    readline.close();
});
