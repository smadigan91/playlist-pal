import React, { useState } from 'react';
import { usePlaylist } from '../context/PlaylistContext';
import SearchBar from './SearchBar';
import { Song } from '../types';

const PlaylistView: React.FC = () => {
  const { selectedPlaylist, addSongToPlaylist } = usePlaylist();
  const [searchResults, setSearchResults] = useState<Song[]>([]);

  const handleSearch = async (query: string) => {
    const response = await fetch(`http://localhost:8080/api/songs/search?q=${query}`);
    const data = await response.json();
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