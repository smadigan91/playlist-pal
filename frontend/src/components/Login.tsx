import React from 'react';

// context
import { usePlaylist } from '../context/PlaylistContext';

// routing
import { redirect } from "react-router";

// styles
import '../styles/login.css';

interface LoginProps {
  onLogIn: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogIn }) => {

  // const { 
  //     // playlists, 
  //     // createPlaylist, 
  //     // selectedPlaylist, 
  //     // setSelectedPlaylist,
  //     // isAuthenticated,
  //     // user,
  //     login,
  //     logout
  //   } = usePlaylist();

  const callSpotifyLogin = () => {
    // login();
    onLogIn();

    return redirect(`/`);
  }

  return (
    <div className='login-container'>
      <div>Login to Spotify to use features of this App!</div>
      <button className='auth-button' onClick={callSpotifyLogin}>Login with Spotify</button>
    </div>
  )
}

export default Login;