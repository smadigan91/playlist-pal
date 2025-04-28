import React, { useEffect, useState } from 'react';

// components
import Navbar from './Navbar';
import PlaylistView from './PlaylistView';
import Player from './Player';

// contexts
import { usePlaylist } from '../context/PlaylistContext';
import { useNavigate } from 'react-router-dom';
import { userInfo } from 'os';

const Main: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const { checkAuthStatus, isAuthenticated } = usePlaylist();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    setIsLoggedIn(userInfo !== null);
    console.log('userInfo', userInfo);

    if (!userInfo) navigate('/login');
    checkAuthStatus();
  }, []);

  // TODO: check isAuthenticated and redirect to login if not authenticated
  //   if no user info but we are authenticated, go to main page
  useEffect(() => {
    if (isAuthenticated === null || isAuthenticated) {
      console.log('isAuthenticated', isAuthenticated);
      if (isAuthenticated && !isLoggedIn) navigate('/');
      return;
    }
    
    // if isAuthenticated is false, redirect to login
    navigate('/login');
  }, [isAuthenticated]);

  return (
    <div className="main">
      <Navbar />
      <div className="main-container">
        <PlaylistView />
      </div>
      <Player />
    </div>
  )
};

export default Main;