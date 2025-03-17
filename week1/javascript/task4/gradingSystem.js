const readline = require('readline') .createInterface({
    input: process.stdin,
    output: process.stdout
});

const fs = require('fs')

function getGrade(score) {
    if (score >= 0 && score <= 39) return 0;
    if (score >= 40 && score <= 51) return 1;
    if (score >= 52 && score <= 63) return 2;
    if (score >= 64 && score <= 75) return 3;
    if (score >= 76 && score <= 87) return 4;
    if (score >= 88 && score <= 100) return 5;
    return "Invalid score. Please enter number between 0 and 100";
}

readline.question("Enter your course assesment score (0-100): ", (input) => {
    const score = parseInt(input, 10);

    if (!isNaN(score)) {
        console.log("Your grade is: ", getGrade(score));
    } else {
        console.log("invalid input. Please enter a valid number.")
    }

    // Save the results
    const results = {
        score: score,
        grade: getGrade(score)
    };

    fs.writeFile('scoreResults.json', JSON.stringify(results, null, 2), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Results saved to scoreResults.json");
    });

    readline.close();
});
