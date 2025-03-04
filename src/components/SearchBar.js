import React from 'react';
import './styles/SearchBar.css'; // Optional: Add styles for the search bar

const SearchBar = ({ query, onSearch }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Search for a product..."
        value={query}
        onChange={(e) => onSearch(e.target.value.toLowerCase())}
      />
    </div>
  );
};

export default SearchBar; 