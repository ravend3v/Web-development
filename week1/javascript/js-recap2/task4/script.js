function sortArray(arr) {
    return arr.sort((a, b) => a - b); // Sort the arr in ascending order
}

const nums = [5, 2, 8, 1, 9];

console.log(sortArray(nums));