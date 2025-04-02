import React, { useRef } from 'react';

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

  const popupRef = useRef<Window | null>(null); // the popup window used for login

  const { 
      // playlists, 
      // createPlaylist, 
      // selectedPlaylist, 
      // setSelectedPlaylist,
      // isAuthenticated,
      // user,
      login,
      // logout
    } = usePlaylist();

  const callSpotifyLogin = () => {
    windowPopupLogin();

    if (false) {
      onLogIn();
    }

    return redirect(`/`);
  }

  const windowPopupLogin = () => {
    // make sure the width and height are not bigger than the screen
    const popupWidth = Math.min(500, screen.availWidth);
    const popupHeight = Math.min(950, screen.availHeight);
    const topOffset = 50;

    // center the popup in the screen
    const popupLeft = (screen.availWidth - popupWidth) / 2;
    // if the popup is too big for the screen, set it to 0
    // otherwise, set it to the top offset
    // this is to make sure the popup is not too big for the screen
    const popupTop = (topOffset + popupHeight) < screen.availHeight ? topOffset : 0;

    // close the existing popup (if any)
    if (popupRef.current) popupRef.current.close();

    // open a window with proper position and width and height
    const windowStyles=`width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`;
    const popup = window.open('', '_blank', windowStyles);

    // focus on the opened window
    popup?.focus();

    // keep track of the window, so we ensure only one is opened at a time.
    popupRef.current = popup;

    if (popup) login(popup);
  }

  return (
    <div className='login-container'>
      <div>Login to Spotify to use features of this App!</div>
      <button className='auth-button' onClick={callSpotifyLogin}>Login with Spotify</button>
    </div>
  )
}

export default Login;