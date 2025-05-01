import React from 'react';

import { Playlist, User } from '../types/index';

interface PlaylistCardProps {
  playlist: Playlist
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const separator_char = '•';

  return (
    <div
      className='bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform'
    >
      <img
        className='w-full h-48 object-cover rounded-t-lg'
        src={playlist.image_url || '/placeholder.jpg'}
        alt={playlist.name}
      />
      <div className='px-6 py-3'>
        <h3 className='text-lg font-semibold mb-1 text-white'>{playlist.name}</h3>
        <p className='text-sm text-gray-300 mb-5 line-clamp-2'>{playlist.description}</p>
        <div className='flex justify-between items-center text-sm text-gray-400'>
          <div className='flex items-center gap-2'>
            <img
              src={(playlist.owner as User).profile_image_url || '/placeholder-profile.jpg'}
              alt={`${playlist.owner as string}'s profile`}
              className='w-6 h-6 rounded-full'
            />
            <div className='font-medium'>{playlist.owner as string}</div>
          </div>
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1'>
              <i className="fas fa-users"></i>
              <span>{playlist.collaborators as number || 0}</span>
            </div>{separator_char}
            <span>{playlist.tracks as number || 0} tracks</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaylistCard;