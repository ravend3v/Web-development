// Imports
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// new array
let fruits = ["Apple", "Banana", "Orange", "Grape", "Kiwi"];

// Display the array
console.log(`Fruits: ${fruits}`);

// Calc the length of the array
let length = fruits.length;
console.log(`Length of fruits: ${length}`);

// Access the element on the 2nd index
let element = fruits[2];
console.log(`Element at index 2: ${element}`);

// Display the last element
let lastElement = fruits[length - 1];
console.log(`Last element of fruits: ${lastElement}`);

let vegetables = [];

// Function to prompt the user to enter vegetables
function askForVegetable(count, i = 0) {
    if (i < count) {
        readline.question(`Enter a vegetable: `, (vegetable) => {
            try {
                vegetables.push(vegetable);
            } catch (error) {
                console.log(`Error: ${error}`);
            }
            askForVegetable(count, i + 1);
        });
    } else {
        console.log(`Vegetables: ${vegetables}`);
        readline.close();
        process.stdin.destroy();
    }
}

// Start prompting the user
askForVegetable(3);

