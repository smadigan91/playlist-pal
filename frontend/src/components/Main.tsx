import React from 'react';

// components
import PlaylistView from '../components/PlaylistView';
import Player from '../components/Player';

const Main: React.FC = () => {
  return (
    <div className="app">
      <div className="main-container">
        <PlaylistView />
      </div>
      <Player />
    </div>
  )
};

export default Main;