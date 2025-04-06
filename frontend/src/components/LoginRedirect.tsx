import React, { useEffect } from 'react';

// types
import { User } from '../types';

// TODO: Add loading spinner and better styling
const LoginRedirect: React.FC = () => {

  useEffect(() => {
    // Function to handle the redirect URI and send the token to the opener window
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const isSuccess = params.get('success');

    if (isSuccess) {
      // Store the user info in local storage
      localStorage.setItem('userInfo', JSON.stringify(isSuccess));
      window.opener.postMessage({ type: 'success', payload: isSuccess }, window.location.origin);
    }
  }, [])

  return (
    <div>Post Login</div>
  )
}

export default LoginRedirect;