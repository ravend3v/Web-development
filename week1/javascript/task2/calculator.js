const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const fs = require('fs');

// Using the readline module to ask the user for input and split

readline.question('Enter the coordinates of the first point (x1 y1): ', (firstPoint) => {
    readline.question('Enter the coordinates of the second point (x2 y2): ', (secondPoint) => {
        const [x1, y1] = firstPoint.split(' ').map(Number);
        const [x2, y2] = secondPoint.split(' ').map(Number);
        
        const dist = distance(x1, y1, x2, y2);

        // Create an object to store the results
        const results = {
            firstPoint: { x: x1, y: y1 },
            secondPoint: { x: x2, y: y2 },
            distance: dist
        };
            
        // Save the results to a JSON file
        fs.writeFile('results.json', JSON.stringify(results, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Results saved to results.json');
        });

        readline.close();
    });
});

