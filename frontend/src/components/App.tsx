import React, { useEffect, useState } from 'react';

// components
import Main from './Main';
import Login from './Login';
import LoginRedirect from './LoginRedirect';

// providers
import { PlaylistProvider } from '../context/PlaylistContext';

// routing
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';

// styles
import '../styles/global.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem('userInfo') !== null
  );

  const navigate = useNavigate();

  // if no login info, redirect to login page
  useEffect(() => {
    // TODO: check auth token expiration with auth API maybe?
    if (!isLoggedIn) return;

    // Login component sets a successful login boolean
    const userInfo = localStorage.getItem('userInfo');
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

  return (
    <PlaylistProvider>
      <Routes>
        <Route path='/' element={isLoggedIn ? <Main /> : <Navigate to='/login' />} />
        <Route path='/login' element={<Login onLogIn={logIn} />} />
        <Route path='/postlogin' element={<LoginRedirect />} />
      </Routes>
    </PlaylistProvider>
  );
};

export default App;
