export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  albumCover: string;
}

export interface Playlist {
  id: number;
  name: string;
  owner: string;
  songs: Song[];
}

export interface User {
  id: number;
  username: string;
  email: string;
}