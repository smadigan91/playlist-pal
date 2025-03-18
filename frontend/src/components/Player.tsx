/**
 * NOTE: Do we want a player in the app or are we intending to only use the app to generate playlists that are exported to spotify?
 */

import React from 'react';

const Player: React.FC = () => {
  return (
    <div className="player">
      <div className="player-controls">
        <button className="control-button">
          <i className="fas fa-step-backward"></i>
        </button>
        <button className="control-button play">
          <i className="fas fa-play"></i>
        </button>
        <button className="control-button">
          <i className="fas fa-step-forward"></i>
        </button>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: '0%' }}></div>
      </div>
    </div>
  );
};

export default Player;
