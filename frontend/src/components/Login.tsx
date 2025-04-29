import React, { useRef } from 'react';
import '../styles/login.css';

// components
import Navbar from './Navbar';

// context
import { usePlaylist } from '../context/PlaylistContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const popupRef = useRef<Window | null>(null); // the popup window used for login

  const navigate = useNavigate();
  const { login } = usePlaylist();

  const callSpotifyLogin = () => windowPopupLogin();

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
    const windowStyles = `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`;
    const popup = window.open('', '_blank', windowStyles);

    // Listen for messages from the popup
    window.addEventListener('message', (event) => {
      if (event.origin === window.location.origin) {
        const { type, payload } = event.data;
        if (type === 'success' && payload) {
          if (popup) popup.close(); // Close the popup

          // Call the onLogIn function to update the state in the parent component
          navigate('/'); // Redirect to the main page
        }
      }
    });

    // focus on the opened window
    popup?.focus();

    // keep track of the window, so we ensure only one is opened at a time.
    popupRef.current = popup;

    if (popup) login(popup);
  }

  return (
    <div className='login-page'>
      <Navbar />
      <div className='login-container'>
        <div>Login to Spotify to use features of this App!</div>
        <button className='auth-button' onClick={callSpotifyLogin}>Login with Spotify</button>
      </div>
    </div>
  )
}

export default Login;