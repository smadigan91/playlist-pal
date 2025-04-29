import React from 'react';
import '../styles/global.css';

// components
import Login from './Login';
import LoginRedirect from './LoginRedirect';
import Main from './Main';

// routing
import { Routes, Route } from 'react-router-dom';

const App: React.FC = () => {

  // TODO: default to show login for all routes if no user info
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/login' element={<Login />} />
        <Route path='/postlogin' element={<LoginRedirect />} />
        {/* <Route path='/settings' element={<UserSettings />} /> */}
      </Routes>
    </div>
  );
};

export default App;
