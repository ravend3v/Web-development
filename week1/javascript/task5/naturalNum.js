// Prompt the user for a positive integer
let num = parseInt(prompt('Enter a positive integer: '));

// Validate the input
if (!isNaN(num) && num > 0) {
    sumNatural(num);
}

// Function to calculate the sum of natural numbers
function sumNatural(num) {
    let sum = 0;

    for (let i = 1; i <= num; i++) {
        sum += i;
    }

    console.log(`The sum of the first ${num} natural numbers is: ${sum}`);

    // Insert the sum into the HTML document
    document.getElementById('sum-container').innerHTML = `The sum of the first ${num} natural numbers is: ${sum}`;
}
