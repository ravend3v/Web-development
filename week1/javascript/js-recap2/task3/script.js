let numbers = [];
let input;

do {
    input = prompt("Enter a number (or type 'done' to finish: ");
    if (input.toLowerCase() !== 'done' && !isNaN(input)) {
        numbers.push(Number(input));
    }
} while (input.toLowerCase() !== 'done');

let evenNums = [];

// Go trough the evenNums
for (let num of numbers) {
    if (num % 2 === 0) {
        evenNums.push(num)
    }
}

let output = document.getElementById("output");
output.innerHTML = "Even numbers: " + (evenNums.length ? evenNums.join(", ") : "None");
