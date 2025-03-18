// Prompt the the user got score
let score = parseInt(prompt('Enter your score: '));

// Validate the input
if (!isNaN(score) && score >= 0 && score <= 100) {
    grade(score);
}

// Function to check the grade based on the score
function grade(score) {
    let grade;

    if (score >= 0 && score <= 39) {
        grade = 0;
    } else if (score >= 40 && score <= 51) {
        grade = 1;
    } else if (score >= 52 && score <= 63) {
        grade = 2;
    } else if (score >= 64 && score <= 75) {
        grade = 3;
    } else if (score >= 76 && score <= 87) {
        grade = 4;
    } else if (score >= 88 && score <= 100) {
        grade = 5;
    }

    console.log(`Your score is: ${score}`);
    console.log(`Your grade is: ${grade}`);

    // Insert the grade into the HTML document
    document.getElementById('score-container').innerHTML = `Your score is: ${score}`;
    document.getElementById('grade-container').innerHTML = `Your grade is: ${grade}`;
}
