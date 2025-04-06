import React, { useEffect, useState } from 'react';
import '../styles/global.css';

// components
import Login from './Login';
import LoginRedirect from './LoginRedirect';
import Main from './Main';
import Navbar from './Navbar';

// context
import { usePlaylist } from '../context/PlaylistContext';

// routing
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem('userInfo') !== null
  );

  const navigate = useNavigate();

  const { setUser } = usePlaylist();

  // if no login info, redirect to login page
  useEffect(() => {
    // TODO: check auth token expiration with auth API maybe?
    if (!isLoggedIn) return;

    // Login component sets a successful login boolean
    const userInfo = localStorage.getItem('userInfo');
    setUser(JSON.parse(userInfo));
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
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path='/' element={isLoggedIn ? <Main /> : <Navigate to='/login' />} />
        <Route path='/login' element={<Login onLogIn={logIn} />} />
        <Route path='/postlogin' element={<LoginRedirect />} />
        {/* <Route path='/settings' element={<UserSettings />} /> */}
      </Routes>
    </>
  );
};

export default App;
