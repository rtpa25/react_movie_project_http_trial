import React, { useState, useEffect, useCallback } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setisLoading(true);
    seterror(null);
    //this seems like the code is synchronos while it is coverted to the promises under the hood
    // and the process is async but this version is easier to read rather than those promise chains
    try {
      const response = await fetch("https://swapi.dev/api/films");
      if (!response.ok) {
        //if this line gets called then the code next to it in the try block wont get executed any more
        //it will move to the catch block
        throw new Error("Something went wrong");
      }
      const data = await response.json();

      const transformedMovies = data.results.map((movie) => {
        return {
          id: movie.episode_id,
          title: movie.title,
          openingText: movie.opening_crawl,
          releaseDate: movie.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      seterror(error.message);
    }
    setisLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading && movies.length === 0 && !error && (
          <p>Press the button to get movies</p>
        )}
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
      </section>
    </React.Fragment>
  );
}

export default App;
