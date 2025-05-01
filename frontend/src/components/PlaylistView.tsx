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
    <div className="p-6 bg-gray-900 text-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-500 mb-4">Discover Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                className="w-full h-40 object-cover"
                src={playlist.image || '/placeholder.jpg'}
                alt={playlist.name}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{playlist.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{playlist.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <div>{playlist.owner}</div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span>👥</span>
                      <span>{playlist.collaborators || 0}</span>
                    </div>
                    <span>{playlist.tracks || 0} tracks</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-500 mb-4">Your Playlists</h2>
        {/* Add your playlists here */}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-green-500 mb-4">Your Collaborations</h2>
        {/* Add your collaborations here */}
      </div>
    </div>
  );
};

export default PlaylistView;