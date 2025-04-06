import React, { useEffect, useState } from 'react';
import '../styles/global.css';

// components
import Login from './Login';
import LoginRedirect from './LoginRedirect';
import Main from './Main';
import Navbar from './Navbar';

// context
import { PlaylistProvider } from '../context/PlaylistContext';

// routing
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem('userInfo') !== null
  );

  const navigate = useNavigate();

  useEffect(() => {
    // TODO: check auth token expiration with auth API maybe?
    if (!isLoggedIn) return;

  }, [isLoggedIn])

  const logIn = () => {
    setIsLoggedIn(true);
    navigate('/');
  }

  // pass this callback to components you want to allow logging out
  // it will update the local state and then get persisted
  const logOut = () => {
    localStorage.setItem('userInfo', 'false');
    setIsLoggedIn(false);
  }

  // TODO: default to show login for all routes if no user info
  return (
    <PlaylistProvider>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={isLoggedIn ? <Main /> : <Navigate to='/login' />} />
        <Route path='/login' element={<Login onLogIn={logIn} />} />
        <Route path='/postlogin' element={<LoginRedirect />} />
        {/* <Route path='/settings' element={<UserSettings />} /> */}
      </Routes>
    </PlaylistProvider>
  );
};

export default App;
