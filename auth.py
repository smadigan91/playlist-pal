import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from flask import session
import logging

# Get the Replit domain from environment
REPLIT_DOMAIN = os.environ.get('REPL_SLUG', '') + '.' + os.environ.get('REPL_OWNER', '') + '.repl.co'
SPOTIFY_REDIRECT_URI = f'https://{REPLIT_DOMAIN}/callback'
SCOPE = 'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private'

def create_spotify_oauth():
    """Create SpotifyOAuth object with proper configuration"""
    logging.info(f"Creating Spotify OAuth with redirect URI: {SPOTIFY_REDIRECT_URI}")
    try:
        return SpotifyOAuth(
            client_id=os.environ['SPOTIFY_CLIENT_ID'],
            client_secret=os.environ['SPOTIFY_CLIENT_SECRET'],
            redirect_uri=SPOTIFY_REDIRECT_URI,
            scope=SCOPE,
            show_dialog=True  # Force display of Spotify auth dialog
        )
    except Exception as e:
        logging.error(f"Error creating Spotify OAuth: {str(e)}")
        raise

def get_spotify_client():
    """Get an authenticated Spotify client using the session token."""
    try:
        if not session.get('token_info'):
            logging.warning("No token info found in session")
            return None

        sp_oauth = create_spotify_oauth()
        token_info = session.get('token_info')

        # Check if token needs refresh
        if sp_oauth.is_token_expired(token_info):
            logging.info("Token expired, refreshing...")
            try:
                token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
                session['token_info'] = token_info
            except Exception as e:
                logging.error(f"Error refreshing token: {str(e)}")
                return None

        return spotipy.Spotify(auth=token_info['access_token'])
    except Exception as e:
        logging.error(f"Error getting Spotify client: {str(e)}")
        return None