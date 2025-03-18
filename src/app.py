from flask import Flask, request, jsonify, redirect, session
from flask_cors import CORS

from .config.env import *
from .logging.logger import log
from .persistence.database import db
from .persistence.user_service import create_user, get_user_by_spotify_id
from .spotify.auth import sp_oauth, get_spotify_client

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


@app.route("/login")
def login():
    """Initiate Spotify OAuth flow"""
    try:
        auth_url = sp_oauth.get_authorize_url()
        log.info("Generated Spotify authorization URL")
        return jsonify({"loginUrl": auth_url})
    except Exception as e:
        log.error(f"Error initiating login: {str(e)}")
        return jsonify({"error": "Failed to initiate login"}), 500
    

@app.route("/auth")
def callback():
    """Handle Spotify OAuth callback"""
    try:
        log.info("Received callback request")
        session.clear()

        error = request.args.get('error')
        if error:
            log.error(f"Spotify auth error: {error}")
            return f"Authentication error: {error}", 400

        code = request.args.get('code')
        if not code:
            log.error("No code parameter in callback")
            return "No authorization code provided", 400

        # Get user info and create/update user in database
        client = get_spotify_client(code)
        if client:
            try:
                spotify_user = client.get_current_user()
                log.info(f"Got Spotify user info: {spotify_user.id}")
                user = get_user_by_spotify_id(spotify_user.id)

                if user:
                    log.info("Found existing information for current user")
                else:
                    log.info("No existing information found for current user, creating new one")
                    create_user(spotify_user)
                    log.info(f"Created new user: {spotify_user.display_name}")

                log.info("Authentication successful, redirecting home")
                session['user_id'] = spotify_user.id
                return redirect('/')
            except Exception as e:
                log.error(f"Error getting user info: {str(e)}")
                return "Error getting user info from Spotify", 400
        return "Failed to get Spotify client", 400
    except Exception as e:
        log.error(f"Callback error: {str(e)}")
        return f"Authentication error: {str(e)}", 400
    

@app.route("/logout")
def logout():
    """Clear user session"""
    session.clear()
    return jsonify({"success": True})


# @app.route("/api/me")
# def get_current_user():
#     """Get current user info"""
#     if 'user_id' not in session:
#         return jsonify({"authenticated": False})
#
#     user = User.query.get(session['user_id'])
#     return jsonify({
#         "authenticated": True,
#         "user": {
#             "id": user.id,
#             "username": user.username,
#             "email": user.email
#         }
#     })