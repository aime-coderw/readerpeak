import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./pages/Library.css"; // Reuse your library CSS for grid styling

export default function SearchResults() {
  const location = useLocation();
  const { query, results } = location.state || { query: "", results: [] };

  if (!results || results.length === 0) {
    return (
      <div className="library-container">
        <h1>Search Results</h1>
        <p style={{ textAlign: "center" }}>
          No results found for "{query}".
        </p>
      </div>
    );
  }

  return (
    <div className="library-container">
      <h1>Search Results for "{query}"</h1>

      <div className="books-grid">
        {results.map((book) => (
          <div className="book-card" key={book.id}>
            <img src={book.cover_url} alt={book.title} />
            <h3>{book.title}</h3>
            <div className="book-actions">
              <Link to={`/story/${book.id}`} className="read-btn">Read Now</Link>
              <Link to={`/book/${book.id}`} className="download-btn">Download Book</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
