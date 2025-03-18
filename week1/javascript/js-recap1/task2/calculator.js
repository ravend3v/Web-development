// Prompt user for 2 points and calculate the distance between them
for (let i = 0; i < 2; i++) {
    let x = prompt(`Enter x${i + 1}`);
    let y = prompt(`Enter y${i + 1}`);
    if (i === 0) {
        var point1 = { x: x, y: y };
    } else {
        var point2 = { x: x, y: y };
    }
}

// Function to calculate distance between 2 points
function calculateDistance(point1, point2) {
    let x = point2.x - point1.x;
    let y = point2.y - point1.y;
    return Math.sqrt(x * x + y * y);
}

// Add the result to the page
document.getElementById("result").innerHTML = `The distance between the two points is ${calculateDistance(point1, point2)}`;

