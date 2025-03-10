/**
 * This component is a search bar that allows the user to search for songs.
 * 
 * TODO: Is this searching for songs in all of spotify or only in the current playlist? It should probably be 
 *   all of spotify so the user can add songs to the playlist.
 */

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for songs..."
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
