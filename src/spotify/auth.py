from __future__ import annotations

from flask import session
from spotipy.cache_handler import RedisCacheHandler
from spotipy.oauth2 import SpotifyOAuth

from .client import SpotifyClient
from ..config.env import *
from ..errors.base import SpotifyError
from ..logging.logger import log

SPOTIFY_REDIRECT_URI = f'{BASE_URL}/auth'
SCOPE = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private'


def init_oauth():
    redis_conn = get_redis_connection()
    if redis_conn:
        return SpotifyOAuth(client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIFY_CLIENT_SECRET,
                            redirect_uri=SPOTIFY_REDIRECT_URI, scope=SCOPE, show_dialog=True,
                            cache_handler=RedisCacheHandler(redis=get_redis_connection()))
    else:
        return SpotifyOAuth(client_id=SPOTIFY_CLIENT_ID, client_secret=SPOTIFY_CLIENT_SECRET,
                            redirect_uri=SPOTIFY_REDIRECT_URI, scope=SCOPE, show_dialog=True)


sp_oauth = init_oauth()


class SpotifyAuthError(SpotifyError):

    def __init__(self, message, cause=None):
        super().__init__(message, 401, cause)


def get_spotify_client(code=None):
    """Get an authenticated Spotify client using the session token.
       Handles refreshing of access token if expired."""
    try:
        if code:
            # if auth code given, fetch new access token and set in session
            log.info("Getting new access token")
            try:
                token_info = sp_oauth.get_access_token(code, check_cache=False)
                log.info("Successfully obtained access token")
                session['token_info'] = token_info
            except Exception as e:
                raise SpotifyAuthError("Error getting Spotify access token", e)
        else:
            # if no auth code given, attempt to find token in session
            token_info = session.get('token_info')
            if not token_info:
                log.warning("No token info found in session")
                return None  # should probably redirect to login if we return none

            # refresh token if necessary
            if sp_oauth.is_token_expired(token_info):
                log.info("Token expired, refreshing...")
                try:
                    token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
                    session['token_info'] = token_info
                except Exception as e:
                    raise SpotifyAuthError("Error refreshing Spotify access token", e)
    except SpotifyAuthError as spex:
        raise spex
    except Exception as ex:
        raise SpotifyError("Unexpected error creating Spotify client", 500, ex)

    return SpotifyClient(access_token=token_info['access_token'])
