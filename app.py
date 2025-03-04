import os
from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, session, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.orm import DeclarativeBase
from werkzeug.security import generate_password_hash
import logging
from auth import create_spotify_oauth, get_spotify_client

logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__, 
    static_folder='frontend/build',
    template_folder='frontend/build')
CORS(app)

app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///playlists.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

from models import User, Playlist, Song, PlaylistSong

@app.route("/login")
def login():
    """Initiate Spotify OAuth flow"""
    try:
        sp_oauth = create_spotify_oauth()
        auth_url = sp_oauth.get_authorize_url()
        logging.info("Generated Spotify authorization URL")
        return jsonify({"loginUrl": auth_url})
    except Exception as e:
        logging.error(f"Error initiating login: {str(e)}")
        return jsonify({"error": "Failed to initiate login"}), 500

@app.route("/callback")
def callback():
    """Handle Spotify OAuth callback"""
    try:
        logging.info("Received callback request")
        sp_oauth = create_spotify_oauth()
        session.clear()

        error = request.args.get('error')
        if error:
            logging.error(f"Spotify auth error: {error}")
            return f"Authentication error: {error}", 400

        code = request.args.get('code')
        if not code:
            logging.error("No code parameter in callback")
            return "No authorization code provided", 400

        logging.info("Getting access token")
        try:
            token_info = sp_oauth.get_access_token(code, check_cache=False)
            logging.info("Successfully obtained access token")
            session['token_info'] = token_info
        except Exception as e:
            logging.error(f"Error getting access token: {str(e)}")
            return "Failed to get access token", 400

        # Get user info and create/update user in database
        sp = get_spotify_client()
        if sp:
            try:
                spotify_user = sp.current_user()
                logging.info(f"Got Spotify user info: {spotify_user.get('id')}")

                user = User.query.filter_by(email=spotify_user['email']).first()
                if not user:
                    user = User(
                        username=spotify_user['display_name'] or spotify_user['id'],
                        email=spotify_user['email'],
                        password_hash=generate_password_hash(os.urandom(24).hex())
                    )
                    db.session.add(user)
                    db.session.commit()
                    logging.info(f"Created new user: {user.username}")

                session['user_id'] = user.id
                logging.info("Authentication successful, redirecting to home")
                return redirect('/')
            except Exception as e:
                logging.error(f"Error getting user info: {str(e)}")
                return "Error getting user info from Spotify", 400
        return "Failed to get Spotify client", 400
    except Exception as e:
        logging.error(f"Callback error: {str(e)}")
        return f"Authentication error: {str(e)}", 400

@app.route("/logout")
def logout():
    """Clear user session"""
    session.clear()
    return jsonify({"success": True})

@app.route("/api/me")
def get_current_user():
    """Get current user info"""
    if 'user_id' not in session:
        return jsonify({"authenticated": False})

    user = User.query.get(session['user_id'])
    return jsonify({
        "authenticated": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    })

@app.route("/")
def serve_frontend():
    try:
        return render_template('index.html')
    except Exception as e:
        logging.error(f"Error serving frontend: {str(e)}")
        return str(e), 500

@app.route("/api/playlists", methods=["GET"])
def get_playlists():
    playlists = Playlist.query.all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "owner": p.owner.username,
        "songs": len(p.songs)
    } for p in playlists])

@app.route("/api/playlists", methods=["POST"])
def create_playlist():
    data = request.json
    playlist = Playlist(name=data["name"], owner_id=1)  # Default user
    db.session.add(playlist)
    db.session.commit()
    return jsonify({"id": playlist.id, "name": playlist.name})

@app.route("/api/songs/search", methods=["GET"])
def search_songs():
    query = request.args.get("q", "")
    songs = Song.query.filter(Song.title.ilike(f"%{query}%")).all()
    return jsonify([{
        "id": s.id,
        "title": s.title,
        "artist": s.artist,
        "duration": s.duration,
        "albumCover": s.album_cover
    } for s in songs])

@app.route("/api/playlists/<int:playlist_id>/songs", methods=["POST"])
def add_song_to_playlist(playlist_id):
    data = request.json
    playlist_song = PlaylistSong(playlist_id=playlist_id, song_id=data["songId"])
    db.session.add(playlist_song)
    db.session.commit()
    return jsonify({"success": True})

# Serve React static files
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('frontend/build', path)

with app.app_context():
    db.create_all()

    # Ensure default user exists
    if not User.query.filter_by(id=1).first():
        default_user = User(
            username="default_user",
            email="default@example.com",
            password_hash=generate_password_hash("default_password")
        )
        db.session.add(default_user)
        db.session.commit()

    # Add mock data if database is empty
    if not Song.query.first():
        mock_songs = [
            Song(title="Bohemian Rhapsody", artist="Queen", duration="5:55", 
                 album_cover="https://images.unsplash.com/photo-1587731556938-38755b4803a6"),
            Song(title="Imagine", artist="John Lennon", duration="3:03",
                 album_cover="https://images.unsplash.com/photo-1511367461989-f85a21fda167"),
            # Add more mock songs
        ]
        db.session.bulk_save_objects(mock_songs)
        db.session.commit()