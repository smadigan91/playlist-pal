/**
 * This file contains all the types that are used in the frontend.
 * 
 * Using `interface` is a way to define types in typescript that are extensible
 * and can be used to define the shape of objects.
 * 
 * We can use `type` to define custom types as well, but `interface` is more
 * commonly used in typescript. Using `type` should be used when we don't want a type to be extended 
 * or modified by the code. 
 */

export interface Playlist {
  id: number;
  name: string;
  owner: string;
  songs: Song[];
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  albumCover: string;
}

export interface User {
  user_id: string;
  display_name: string;
  profile_image_url: string;
}