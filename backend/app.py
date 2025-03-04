import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.orm import DeclarativeBase
import logging

logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)
CORS(app)

app.secret_key = os.environ.get("SESSION_SECRET", "dev_secret_key")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///playlists.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

from models import User, Playlist, Song, PlaylistSong

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
    playlist = Playlist(name=data["name"], owner_id=1)  # Mock user
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

with app.app_context():
    db.create_all()

    # Add mock data if database is empty
    if not Song.query.first():
        mock_songs = [
            Song(title="Bohemian Rhapsody", artist="Queen", duration="5:55", 
                 album_cover="https://images.unsplash.com/photo-1587731556938-38755b4803a6"),
            Song(title="Imagine", artist="John Lennon", duration="3:03",
                 album_cover="https://images.unsplash.com/photo-1511367461989-f85a21fda167"),
            # Add more mock songs...
        ]
        db.session.bulk_save_objects(mock_songs)
        db.session.commit()
