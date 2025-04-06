import React, { useEffect } from 'react';
import '../styles/navbar.css';

// components
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

// context
import { usePlaylist } from '../context/PlaylistContext';

const Navbar: React.FC = () => {

  const { user } = usePlaylist();

  return (
    <div className='navbar'>
      <div className='navbar-logo'></div>
      <div className='navbar-user'>
        <Menu>
          <MenuButton>
            <div className='user-info'>
              <img className='spotify-profile-image' src={user?.profile_image_url} alt='user' />
              <span className='spotify-displayname'>{user?.display_name || 'User'}</span>
            </div>
          </MenuButton>
          <MenuItems className='user-dropdown [--anchor-gap:10px]' anchor='bottom' >
            <MenuItem as='a' className='block data-[focus]:bg-blue-100' href='/settings'>
              User Settings
            </MenuItem>
            <MenuItem as='a' className='block data-[focus]:bg-blue-100' href='/logout'>
              Log Out
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  )
}

export default Navbar;