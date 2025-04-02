/**
 * Sidebar component that displays the logo, user info, playlist list, and login prompt.
 * 
 * TODO: Do we want to keep this component this way or should we reconsider the layout and design?
 */

import React from 'react';
import { usePlaylist } from '../context/PlaylistContext';

const Sidebar: React.FC = () => {
  // Get functions and variables from the provider using the custom hook we defined in `PLaylistContext.tsx`
  const { 
    playlists, 
    createPlaylist, 
    selectedPlaylist, 
    setSelectedPlaylist,
    isAuthenticated,
    user,
    // login,
    logout
  } = usePlaylist();

  const handleCreatePlaylist = () => {
    // TODO: verify this works as expected and consider a different UI for this

    // The prompt function is a built-in method in JavaScript and TypeScript that pauses 
    // the execution of the script and waits for the user to input a value. Once the user 
    // enters a value and confirms, the function returns the input as a string. If the 
    // user cancels the prompt, the function returns null.
    const name = prompt('Enter playlist name:');
    if (name) {
      createPlaylist(name);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>Collaborative Playlist</h1>
      </div>
      {isAuthenticated ? (
        <>
          <div className="user-info">
            <p>Welcome, {user?.username}!</p>
            <button onClick={logout} className="auth-button">Logout</button>
          </div>
          <button className="create-playlist" onClick={handleCreatePlaylist}>
            Create Playlist
          </button>
          <div className="playlist-list">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={`playlist-item ${selectedPlaylist?.id === playlist.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                {playlist.name}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="login-prompt">
          <p>Log in with Spotify to create and manage playlists</p>
          <button onClick={() => {}} className="auth-button">
            Login with Spotify
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;