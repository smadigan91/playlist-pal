import spotipy

from .models import *
from ..logging.logger import log

MAX_PLAYLIST_SIZE = 10000


class SpotifyClientException(Exception):

    def __init(self, message):
        super(SpotifyClientException, self).__init__(message)

    @property
    def message(self):
        return self.message


class SpotifyClient:
    """
    Wraps Spotipy's own client for use with our models and other conveniences.
    """

    def __init__(self, access_token):
        self.sp = spotipy.Spotify(auth=access_token)
        self.current_user = self.sp.current_user()
        self.filter_map = {}

    def get_playlist_tracks(self, playlist_id, track_limit=None):
        tracks = set()
        playlist_info = self.sp.playlist(playlist_id)
        playlist_name = playlist_info['name']
        playlist = self.sp.playlist_tracks(playlist_id,
                                           limit=track_limit if track_limit and track_limit <= 100 else 100)
        tracks.update(Track(item['track']) for item in playlist['items'])
        offset = 0
        while playlist['next'] and (track_limit is None or track_limit != len(tracks)):
            limit = track_limit - len(tracks) if track_limit else 100
            offset = offset + 100
            playlist = self.sp.playlist_tracks(playlist_id, limit=limit if limit <= 100 else 100, offset=offset)
            tracks.update(Track(item['track']) for item in playlist['items'])
        log.info(f"Retrieved {len(tracks)} tracks for playlist {playlist_name}")
        return playlist_name, tracks

    # this should return the user wrapped in our own spotify User object
    def get_current_user(self) -> User:
        return User(self.sp.current_user())
