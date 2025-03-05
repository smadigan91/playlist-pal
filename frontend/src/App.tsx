import React from 'react';
import { PlaylistProvider } from './context/PlaylistContext';
import Sidebar from './components/Sidebar';
import PlaylistView from './components/PlaylistView';
import Player from './components/Player';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <PlaylistProvider>
      <div className="app">
        <div className="main-container">
          <Sidebar />
          <PlaylistView />
        </div>
        <Player />
      </div>
    </PlaylistProvider>
  );
};

export default App;
