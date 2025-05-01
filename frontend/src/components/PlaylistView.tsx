/**
 * This component displays the selected playlist and the search results after searching through that playlist.
 */

import React, { useState } from 'react';
import { usePlaylist } from '../context/PlaylistContext';

// components
import PlaylistCard from './PlaylistCard';

// types
import { Playlist, User } from '../types/index';

const PlaylistView: React.FC = () => {
  const { selectedPlaylist, addSongToPlaylist } = usePlaylist();
  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      playlist_id: 1,
      name: 'Late Night Drives',
      description: 'Atmospheric and moody songs perfect for night cruising. Share your favorite night vibes!',
      owner: 'MelodyMaker',
      collaborators: 3,
      tracks: 7,
      image_url: '/images/late-night-drives.jpg',
    },
    {
      playlist_id: 2,
      name: 'Workout Motivation',
      description: 'High-energy tracks to power through your toughest workouts. Let\'s build this together!',
      owner: 'RhythmQueen',
      collaborators: 2,
      tracks: 5,
      image_url: '/images/workout-motivation.jpg',
    },
    {
      playlist_id: 3,
      name: 'Chill Study Sessions',
      description: 'Focus-enhancing tunes for productive study sessions. Add your favorite concentration tracks!',
      owner: 'BeatMaster',
      collaborators: 3,
      tracks: 8,
      image_url: '/images/chill-study-sessions.jpg',
    },
    {
      playlist_id: 4,
      name: 'Summer Vibes 2023',
      description: 'The hottest tracks to keep your summer cool. Collaborative playlist for beach parties!',
      owner: 'MusicLover',
      collaborators: 3,
      tracks: 6,
      image_url: '/images/summer-vibes.jpg',
    },
  ]);

  const PlaylistsRow = (title: string, playlistsSet: Playlist[]) => {
    return (
      <div className='mb-12'>
        <h2 className='text-3xl font-bold text-green-500 mb-6'>{title}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {playlistsSet.map((playlist, index) => {
            // add Playlist component here
            return (<PlaylistCard
              key={index}
              playlist={playlist}
              // onClick={() => {}}
            />)
          })}
        </div>
      </div>
    )
  }

  return (
    <div className='p-6 text-white min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {PlaylistsRow('Discover Playlists', playlists)}
        {PlaylistsRow('Your Playlists', [playlists[0]])}
        {PlaylistsRow('Your Collaborations', [playlists[0], playlists[1]])}
      </div>
    </div>
  );
};

export default PlaylistView;