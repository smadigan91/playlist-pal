import React, { useEffect, useState } from 'react';

// components
import Main from '../components/Main';
import Login from '../components/Login';

// providers
import { PlaylistProvider } from '../context/PlaylistContext';

// routing
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

// styles
import '../styles/global.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem('userInfo') !== null
  );

  // if no login info, redirect to login page
  useEffect(() => {
    if (!isLoggedIn) return;
    
    // TODO: change this, this is just a placeholder until spotify login returns user credentials
    //   Login component should set the user info in local storage
    //   and then this should check for that info
    localStorage.setItem('userInfo', JSON.stringify(isLoggedIn));

    // TODO: uncomment once the above is implemented
    // const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    // if (!userInfo) setIsLoggedIn(false);
  }, [isLoggedIn])

  const logIn = () => setIsLoggedIn(true);

  // pass this callback to components you want to allow logging out
  // it will update the local state and then get persisted
  const logOut = () => setIsLoggedIn(false);

  return (
    <PlaylistProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Main /> : <Navigate to='/login' />} />
          <Route path="/login" element={<Login onLogIn={logIn} />} />
        </Routes>
      </BrowserRouter>
    </PlaylistProvider>
  );
};

export default App;
