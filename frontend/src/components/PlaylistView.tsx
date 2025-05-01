/**
 * This component displays the selected playlist and the search results after searching through that playlist.
 */

import React, { useState } from 'react';
import { usePlaylist } from '../context/PlaylistContext';

const PlaylistView: React.FC = () => {
  // Get the selected playlist "varaible" and the function to add a song to the playlist from 
  // the provider using the custom hook we defined in `PLaylistContext.tsx`
  const { selectedPlaylist, addSongToPlaylist } = usePlaylist();
  const [playlists, setPlaylists] = useState<any[]>([]); // TODO: replace with actual type

  return (
    <div className='playlist-view'>
      <div className='playlist-section'>
        <h2>Discover Playlists</h2>
        <div className='playlist-list'>
          <div className='playlist-list-item'>
            <img className='playlist-image' />
            <div className='playlist-info'>
              <h3 className='playlist-name'></h3>
              <p className='playlist-description'></p>
              <div>
                <div className='playlist-owner'>owner</div>
                <div className='more-platlist-info'>
                  <div className='num-collaborators'>
                    <span className='icon'>I</span>
                    <div className=''>3</div>
                  </div>
                  <span className='num-tracks'>{3} tracks</span>
                </div>
              </div>
            </div>
          </div>
          <div className='playlist-section'>
            <h2>Your PLaylists</h2>
          </div>
          <div className='playlist-section'>
            <h2>Your Collaborations</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;