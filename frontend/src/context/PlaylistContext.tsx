/**
 * Contains the provider and context for the whole application currently. The provider is used to wrap the
 * application and provide the context to all components. The context is used to provide the playlist state
 * and functions to all components that need it.
 * 
 * The provider is defined in here onle and the context calls the provider. The context is then used in the
 * components that need the playlist state and functions.
 * 
 * NOTE: This uses `fetch` to make API calls to the backend. This is a built-in browser function that is used
 * to make HTTP requests. This is a simple way to make API calls but there are other libraries like axios that
 * can be used to make API calls as well. We should consider switching to axios or another library.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Playlist, Song, User } from '../types';

// This is fine to be defined here since the interface communicates the shape of this "provider"
interface PlaylistContextType {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (popup: Window) => void;
  logout: () => void;
  setSelectedPlaylist: (playlist: Playlist) => void;
  createPlaylist: (name: string) => void;
  addSongToPlaylist: (playlistId: number, song: Song) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // local state variables used by the provider
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get the current hostname to use for API calls
  // This is really bad practice and should be changed to use an environment variable. When this is deployed
  // outside of a local environemnt, the hostname will be different and the API calls will break.
  const apiBase = "http://localhost:8080";

  // useEffect hook with an empty dependency array to run once when the component mounts. When component mounts
  // means when usePlaylist is called in a component and this provider initializes.
  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);

  // Function to check the authentication status of the user. This is used to check if the user is logged in
  // before performing performing any actions that require authentication which is everything in the app for
  // now except the actual login function.
  const checkAuthStatus = async () => {
    try {
      // TODO: verify the API endpoint for this
      const response = await fetch(`${apiBase}/me`);
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        setUser(data.user);
        // if we have a user, we can fetch their playlists and continue setting up the UI
        fetchPlaylists();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  // Function to login the user. This is called when the user is not authenticated and needs to login to use the app.
  // Attach this function to the login button in the UI.
  const login = async (popup: Window) => {
    try {
      const response = await fetch(`${apiBase}/login`);
      const data = await response.json();
      if (data.error) {
        console.error('Login error:', data.error);
        return;
      }

      // use the popup window to redirect the user to the login page
      popup.location.href = data.loginUrl;
    } catch (error) {
      console.error('Error initiating login:', error);
    }
  };

  // Function to logout the user. This is called when the user wants to logout of the app.
  // Attach this function to the logout button in the UI.
  const logout = async () => {
    try {
      // TODO: verify the API endpoint for this
      await fetch(`${apiBase}/logout`);

      // if successful, reset the state of the app by clearing the local state variables for
      // the provider to their initial/default values
      // NOTE: As more and more state variables are added to the provider, we will have to reset
      //   all of them here. This is a bit of a pain and we should look into a better way to do this.
      // NOTE: this will not clear the state of the components that are using the context
      setIsAuthenticated(false);
      setUser(null);
      setPlaylists([]);
      setSelectedPlaylist(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Function to fetch the playlists from the API. This is called when the user is authenticated and we need to
  // fetch the playlists to display in the UI.
  const fetchPlaylists = async () => {
    try {
      // TODO: verify the API endpoint for this
      const response = await fetch(`${apiBase}/api/playlists`);
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  // Function to create a playlist. This is called when the user wants to create a new playlist.
  // Attach this function to the create playlist button in the UI.
  const createPlaylist = async (name: string) => {
    if (!isAuthenticated) {
      // alternative way to handle login if we want to let users interact with the app before logged in or authenticated
      // TODO: redirect ot login page or popout a window
      // login();
      return;
    }

    try {
      // TODO: verify the API endpoint for this
      const response = await fetch(`${apiBase}/api/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      // TODO: this seems right but needs to be debugged and tested to make sure it is doing
      // what we expect it to do. This is adding the new playlist to the current list of playlists
      setPlaylists([...playlists, { ...data, songs: [] }]);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  // Function to add a song to a playlist. This is called when the user wants to add a song to a playlist.
  // Attach this function to the add song button in the UI.
  const addSongToPlaylist = async (playlistId: number, song: Song) => {
    if (!isAuthenticated) {
      // alternative way to handle login if we want to let users interact with the app before logged in or authenticated
      // TODO: redirect ot login page or popout a window
      // login();
      return;
    }

    try {
      // TODO: verify the API endpoint for this
      await fetch(`${apiBase}/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: song.id }),
      });

      // TODO: this seems right but needs to be debugged and tested to make sure it is doing
      // what we expect it to do. This is adding the new song to the current list of songs in the playlist
      setPlaylists(playlists.map(p => {
        if (p.id === playlistId) {
          return { ...p, songs: [...p.songs, song] };
        }
        return p;
      }));
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  return (
    <PlaylistContext.Provider
      // value is the object that is provided to all components that use the context. We can have more functions
      // in the provider that are not added to this value property making those functions private to the provider.
      value={{
        playlists,
        selectedPlaylist,
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
        setSelectedPlaylist,
        createPlaylist,
        addSongToPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

/**
 * Custom hook that allows components to interact with the playlist context
 * 
 * This is so we can avoid prop drilling and make it easier to access the playlist context
 * in each component. A type of global state management without using redux or other 3rd party libraries.
 * This should be sufficient for now but we can always switch to redux or another library if needed.
 */
export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
