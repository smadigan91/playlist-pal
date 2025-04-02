import React, { useEffect } from 'react';

const LoginRedirect: React.FC = () => {

  useEffect(() => {
    // Function to handle the redirect URI and send the token to the opener window
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    console.log(params);
    const token = params.get('spotify_token');

    if (token) {
      window.opener.postMessage({ type: 'spotify_token', payload: token }, window.location.origin);
    }
  }, [])

  return (
    <div>Post Login</div>
  )
}

export default LoginRedirect;