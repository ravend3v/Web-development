// Prompt use for sides

let sides = [];

for (let i = 0; i < 3; i++) {
    // Try cath block to handle invalid input
    try {
        sides.push(parseFloat(prompt(`Enter the length of side ${i + 1}: `)));
    } catch (error) {
        console.error(error);
        console.log('Please enter a valid number');
        i--;
    }
}

// Function to check the type of triangle
function checkTriangleType(sides) {
    const [a, b, c] = sides;
    if (a === b && b === c) {
        return 'Equilateral';
    } else if (a === b || b === c || a === c) {
        return 'Isosceles';
    } else {
        return 'Scalene';
    }

}
    
// Add the result to the html
document.getElementById('result').innerHTML = `The triangle is ${checkTriangleType(sides)}`;

