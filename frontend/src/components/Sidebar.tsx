import React from 'react';
import { usePlaylist } from '../context/PlaylistContext';

const Sidebar: React.FC = () => {
  const { 
    playlists, 
    createPlaylist, 
    selectedPlaylist, 
    setSelectedPlaylist,
    isAuthenticated,
    user,
    login,
    logout
  } = usePlaylist();

  const handleCreatePlaylist = () => {
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
          <button onClick={login} className="auth-button">
            Login with Spotify
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;