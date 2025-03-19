function sortArray(arr, order) {
    if (order == "asc") {
        return arr.sort((a, b) => a - b)
    } else if (order == "desc") {
        return arr.sort((a, b) => b - a)
    }
}

const nums = [5, 2, 8, 1, 9];

console.log(sortArray(nums, "asc"));
console.log(sortArray(nums, "desc"));