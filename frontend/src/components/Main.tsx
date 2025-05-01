import React, { useEffect, useRef, useState } from 'react';

// components
import Navbar from './Navbar';
import PlaylistView from './PlaylistView';
import Player from './Player';

// contexts
import { usePlaylist } from '../context/PlaylistContext';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const { checkAuthStatus, isAuthenticated } = usePlaylist();

  // when using react in strict mode, in development the component is mounted twice
  // this prevents the useEffect from running twice and making 2 API requests
  const setupStarted = useRef<boolean>(false);

  useEffect(() => {
    if (setupStarted.current) return;
    setupStarted.current = true;

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
      if (isAuthenticated && !isLoggedIn) navigate('/');
      return;
    }
    
    // if isAuthenticated is false, redirect to login
    navigate('/login');
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <Navbar />
      <div className="main-container w-full max-w-7xl p-6">
        <PlaylistView />
      </div>
      <Player />
    </div>
  );
};

export default Main;