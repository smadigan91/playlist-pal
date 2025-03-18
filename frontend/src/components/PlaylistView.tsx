/**
 * This component displays the selected playlist and the search results after searching through that playlist.
 */

import React, { useState } from 'react';
import { usePlaylist } from '../context/PlaylistContext';
import SearchBar from './SearchBar';
import { Song } from '../types';

const PlaylistView: React.FC = () => {
  // Get the selected playlist "varaible" and the function to add a song to the playlist from 
  // the provider using the custom hook we defined in `PLaylistContext.tsx`
  const { selectedPlaylist, addSongToPlaylist } = usePlaylist();
  // Local state to store the search results
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  // Function to handle the search query. This function is called when the user types in the search bar and hits enter.
  // TODO: verify this works "onEnter" and not on every key press
  const handleSearch = async (query: string) => {
    // TODO: verify the API endpoint for this
    const response = await fetch(`http://localhost:8080/api/songs/search?q=${query}`);
    const data = await response.json();
    // update the local state with the search results to cause the component to rerender and show the search results
    setSearchResults(data);
  };

  return (
    <div className="playlist-view">
      <SearchBar onSearch={handleSearch} />
      {selectedPlaylist ? (
        <>
          <h2>{selectedPlaylist.name}</h2>
          <div className="song-list">
            {selectedPlaylist.songs.map((song) => (
              <div key={song.id} className="song-item">
                <img src={song.albumCover} alt={song.title} />
                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
                <div className="song-duration">{song.duration}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-playlist">Select a playlist</div>
      )}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          {searchResults.map((song) => (
            <div
              key={song.id}
              className="search-result-item"
              onClick={() => selectedPlaylist && addSongToPlaylist(selectedPlaylist.id, song)}
            >
              <img src={song.albumCover} alt={song.title} />
              <div className="song-info">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistView;