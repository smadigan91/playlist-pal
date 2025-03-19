from flask import Flask, request, jsonify, redirect, session, make_response
from flask_cors import CORS

from .config.env import *
from .errors.base import BaseWebAppError
from .logging.logger import log
from .persistence.database import db
from .persistence.user_helper import create_user, get_user_by_spotify_id
from .spotify.auth import sp_oauth, get_spotify_client, SpotifyAuthError

USER_SESSION_IDENTIFIER = 'user_id'

app = Flask(__name__)
CORS(app)

app.secret_key = SESSION_KEY
SESSION_TYPE = 'redis'
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = get_redis_connection()
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI

db.init_app(app)

with app.app_context():
    db.create_all()


# error handling
def default_exception_handler(exception):
    exception_name = type(exception).__name__
    log.error("{}: {} ".format(exception_name, exception), exc_info=True)
    return jsonify({'something unexpected went wrong': exception_name}), 500


def base_webapp_error_handler(exception: BaseWebAppError):
    return jsonify({'error': exception.message, 'cause': type(exception.cause).__name__}), exception.status_code


app.register_error_handler(BaseWebAppError, base_webapp_error_handler)
app.register_error_handler(Exception, default_exception_handler)


@app.errorhandler(404)
def page_not_found(e):
    return jsonify("page not found"), 404


# API

@app.route("/login")
def login():
    """Initiate Spotify OAuth flow"""
    auth_url = sp_oauth.get_authorize_url()
    log.info("Generated Spotify authorization URL")
    return jsonify({"loginUrl": auth_url})


@app.route("/auth")
def callback():
    """Handle Spotify OAuth callback"""
    log.info("Received authentication callback request")
    session.clear()

    error = request.args.get('error')
    if error:
        raise SpotifyAuthError(f"Spotify auth error: {error}")

    code = request.args.get('code')
    if not code:
        raise SpotifyAuthError("No Spotify authorization code given")

    # Get user info and create/update user in database
    client = get_spotify_client(code)
    response = make_response(redirect(FRONTEND_BASE_URL))
    if client:
        spotify_user = client.get_current_user()
        log.info(f"Got Spotify user info: {spotify_user.id}")
        user = get_user_by_spotify_id(spotify_user.id)

        if user:
            log.info("Found existing information for current user")
        else:
            log.info("No existing information found for current user, creating new one")
            user = create_user(spotify_user)
            log.info(f"Created new user: {spotify_user.display_name}")

        log.info("Authentication successful, redirecting home")
        session[USER_SESSION_IDENTIFIER] = spotify_user.id
        for k, v in user.min().items():
            response.set_cookie(k, v)
    return response


@app.route("/logout")
def logout():
    """Clear user session"""
    session.clear()
    return jsonify({"success": True})


@app.route("/me")
def get_current_user():
    """Get current user info"""
    current_user_id = session.get(USER_SESSION_IDENTIFIER)
    if not current_user_id:
        return jsonify({"authenticated": False})

    user = get_user_by_spotify_id(current_user_id)
    return jsonify(user.min())
