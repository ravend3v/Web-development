const movies = [];
const sortedMovies = [];

let numberOfMovies = parseInt(prompt("Enter the number of movies to rate: "), 10);

for (let i = 0; i < numberOfMovies; i++) {
    let movieTitle = prompt(`Enter title for movie ${i + 1}: `);
    let movieRating = parseFloat(prompt(`Enter your rating for movie ${i + 1}: `));

    const movie = {
        title: movieTitle,
        rating: movieRating
    };

    movies.push(movie)
}

// Sort by rating
sortedMovies.push(...movies.sort((a, b) => b.rating - a.rating));

// Highest rated movie
if (sortedMovies.length > 0) {
    let highestRated = sortedMovies[0];

    let displayHighestRated = document.getElementById("highestRating");
    displayHighestRated.innerHTML = `Highest Rated Movie: ${highestRated.title} (${highestRated.rating})`;
}

let ratedMovies = document.getElementById("ratedMovies");
ratedMovies.innerHTML = `Movies sorted by rating: ${sortedMovies.map(movie => `${movie.title} (${movie.rating})`).join(', ')}`;