import React, { createContext, useContext, useState, useEffect } from 'react';
import { Playlist, Song, User } from '../types';

interface PlaylistContextType {
  playlists: Playlist[];
  selectedPlaylist: Playlist | null;
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  setSelectedPlaylist: (playlist: Playlist) => void;
  createPlaylist: (name: string) => void;
  addSongToPlaylist: (playlistId: number, song: Song) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get the current hostname to use for API calls
  const apiBase = "http://localhost:8080";

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${apiBase}/api/me`);
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        setUser(data.user);
        fetchPlaylists();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  const login = async () => {
    try {
      const response = await fetch(`${apiBase}/login`);
      const data = await response.json();
      if (data.error) {
        console.error('Login error:', data.error);
        return;
      }
      window.location.href = data.loginUrl;
    } catch (error) {
      console.error('Error initiating login:', error);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${apiBase}/logout`);
      setIsAuthenticated(false);
      setUser(null);
      setPlaylists([]);
      setSelectedPlaylist(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${apiBase}/api/playlists`);
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const createPlaylist = async (name: string) => {
    if (!isAuthenticated) {
      login();
      return;
    }
    try {
      const response = await fetch(`${apiBase}/api/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      setPlaylists([...playlists, { ...data, songs: [] }]);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const addSongToPlaylist = async (playlistId: number, song: Song) => {
    if (!isAuthenticated) {
      login();
      return;
    }
    try {
      await fetch(`${apiBase}/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId: song.id }),
      });

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
      value={{
        playlists,
        selectedPlaylist,
        user,
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

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
