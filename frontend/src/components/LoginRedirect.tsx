import React, { useEffect } from 'react';

// TODO: Add loading spinner
const LoginRedirect: React.FC = () => {

  useEffect(() => {
    // Function to handle the redirect URI and send the token to the opener window
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('success');

    if (token) {
      window.opener.postMessage({ type: 'success', payload: token }, window.location.origin);
    }
  }, [])

  return (
    <div>Post Login</div>
  )
}

export default LoginRedirect;