const nums = [];

let num;
let searchInput;

const sortedNums = [];

for (i = 1; i <= 5; i++) {
    num = prompt(`Enter number: ${i}`)
    nums.push(Number(num));
}

console.log(`Numbers: ${nums}`)
let numbers = document.getElementById("numbers");
numbers.innerHTML = "Numbers: " + (nums.length ? nums.join(", ") : "");

searchInput = prompt("Enter number to search: ")
if (nums.includes(Number(searchInput))) {
    console.log("Number 7 is found in the array.")
    alert(`Number ${searchInput} is found in the array.`)
} else {
    alert(`Number ${searchInput} is not found in the array.`)
}

nums.pop()

console.log(`Updated Numbers: ${nums}`)
alert(`Updated Numbers: ${nums}`)

let updatedNums = document.getElementById("updatedNumbers");
updatedNums.innerHTML = "Updated Numbers: " + (nums.length ? nums.join(", ") : "");

sortedNums.push(...nums.sort((a, b) => a - b));

console.log(`Sorted Numbers: ${sortedNums}`)
alert(`Sorted Numbers: ${sortedNums}`)

let sorted = document.getElementById("sortedNums");
sorted.innerHTML = "Sorted Numbers: " + (sortedNums.length ? sortedNums.join(", ") : "");
