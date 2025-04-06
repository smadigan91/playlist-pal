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
      // get user info from cookies and store in local storage
      const cookies = document.cookie.split('; ');

      const userInfo: User = {
        user_id: '',
        display_name: '',
        profile_image_url: ''
      };

      cookies.forEach(cookie => {
        const [key, ...valueParts] = cookie.split('=');
        const value = valueParts.join('=');

        const validKeys = ['user_id', 'display_name', 'profile_image_url'];
        if (validKeys.includes(key)) userInfo[key as keyof User] = value.replace(/"/g, '');
      });

      // Store the user info in local storage
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      window.opener.postMessage({ type: 'success', payload: isSuccess }, window.location.origin);
    }
  }, [])

  return (
    <div>Post Login</div>
  )
}

export default LoginRedirect;