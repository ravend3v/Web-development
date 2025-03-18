// Prompt user for a positive integer
let num = parseInt(prompt('Enter a positive integer: '));

// Validate the input
if (!isNaN(num) && num > 0) {
    generateTable(num);
} else {
    console.log('You must enter a positive integer');
}

// Function to generate and display the table
function generateTable(num) {
    let tableHTML = "<table>";

    // Create table rows and columns using nested loops
    for (let i = 1; i <= num; i++) {
        tableHTML += "<tr>";
        for (let j = 1; j <= num; j++) {
            tableHTML += `<td>${i * j}</td>`; // Add each cell
        }
        tableHTML += "\n";
    }

    tableHTML += "</table>";

    // Display the table in the console
    console.log(tableHTML);

    // Insert the table into the HTML document
    document.getElementById('table-container').innerHTML = tableHTML;
}
