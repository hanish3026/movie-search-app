import React, { useState } from 'react';
import './App.css'
const App = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const fetchMovies = async (searchTerm, page) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=e7919b59&s=${searchTerm}&page=${page}`
      );
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies((prevMovies) =>
          page === 1 ? data.Search : [...prevMovies, ...data.Search]
        );
        setError('');
      } else {
        setError("No results are found");
      }
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setPage(1);
      fetchMovies(query, 1);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(query, nextPage);
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4 text-white">Movie Search App</h1>
      <div className="d-flex mb-4">
        <input
          type="text"
          className="form-control p-2 mx-3"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <div className="row">
        {movies.map((movie) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={movie.imdbID}>
            <div className="card h-100">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}
                className="card-img-top"
                alt={movie.Title}
              />
              <div className="card-body text-white">
                <h5 className="card-title">{movie.Title}</h5>
                <p className="card-text">Year: {movie.Year}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {movies.length > 0 && (
        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
