from __future__ import annotations

import datetime
import uuid
from typing import Optional, Any, List

from sqlalchemy import Table, text
from sqlalchemy.orm import Mapped, mapped_column

from ..persistence.database import db, Base

playlist_track = Table(
    "playlist_track",
    Base.metadata,
    db.Column("playlist_id", db.ForeignKey("playlist.id"), primary_key=True),
    db.Column("track_id", db.ForeignKey("track.id"), primary_key=True),
)

class User(db.Model):
    id: Mapped[str] = mapped_column(db.String(64), primary_key=True)
    display_name: Mapped[str] = mapped_column(db.String(64))
    profile_image_url: Mapped[Optional[str]] = mapped_column(db.String(128))
    profile_uri: Mapped[str] = mapped_column(db.String(120))
    playlist_roles: Mapped[Optional[List[PlaylistUser]]] = db.relationship(back_populates="user")
    playlist_saves: Mapped[Optional[List[PlaylistSave]]] = db.relationship(back_populates="user")
    track_likes: Mapped[Optional[List[TrackLike]]] = db.relationship(back_populates="user")

class PlaylistComment(db.Model):
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True, autoincrement=True)
    comment: Mapped[str] = mapped_column(db.String(256))
    playlist_id: Mapped[uuid.UUID] = mapped_column(db.ForeignKey('playlist.id'))
    user_id: Mapped[str] = mapped_column(db.ForeignKey('user.id'))
    playlist: Mapped[Playlist] = db.relationship(back_populates="comments")

class PlaylistSave(db.Model):
    playlist_id: Mapped[uuid.UUID] = mapped_column(db.ForeignKey('playlist.id'), primary_key=True)
    user_id: Mapped[str] = mapped_column(db.ForeignKey('user.id'), primary_key=True)
    spotify_playlist_id: Mapped[Optional[str]] = mapped_column(db.String(64))
    user: Mapped[User] = db.relationship(back_populates="playlist_saves")

class PlaylistUser(db.Model):
    playlist_id: Mapped[uuid.UUID] = mapped_column(db.ForeignKey('playlist.id'), primary_key=True)
    user_id: Mapped[str] = mapped_column(db.ForeignKey('user.id'), primary_key=True)
    role: Mapped[str] = mapped_column(db.String(32))
    playlist: Mapped[Playlist] = db.relationship(back_populates="users")
    user: Mapped[User] = db.relationship(back_populates="playlist_roles")

class Playlist(db.Model):
    id: Mapped[uuid.UUID] = mapped_column(db.Uuid, primary_key=True, server_default=text("gen_random_uuid()"))
    name: Mapped[str] = mapped_column(db.String(128))
    owner_id: Mapped[str] = mapped_column(db.ForeignKey('user.id'))
    rules: Mapped[Optional[dict[str, Any]]] = mapped_column(db.JSON)
    users: Mapped[List[PlaylistUser]] = db.relationship(back_populates="playlist")
    tracks: Mapped[Optional[List[Track]]] = db.relationship(secondary=playlist_track, back_populates="playlists")
    comments: Mapped[Optional[List[PlaylistComment]]] = db.relationship(back_populates="playlist")

class TrackLike(db.Model):
    user_id: Mapped[str] = mapped_column(db.ForeignKey('user.id'), primary_key=True)
    track_id: Mapped[str] = mapped_column(db.ForeignKey('track.id'), primary_key=True)
    user: Mapped[User] = db.relationship(back_populates="track_likes")

class Track(db.Model):
    id: Mapped[str] = mapped_column(db.String(64), primary_key=True)
    name: Mapped[str] = mapped_column(db.String(128))
    duration_ms: Mapped[int] = mapped_column(db.Integer)
    release_date: Mapped[datetime.datetime] = mapped_column(db.Date)
    href: Mapped[str] = mapped_column(db.String(128))
    artist_name: Mapped[str] = mapped_column(db.String(64))
    artist_href: Mapped[str] = mapped_column(db.String(128))
    album_name: Mapped[Optional[str]] = mapped_column(db.String(64))
    album_image_url: Mapped[Optional[str]] = mapped_column(db.String(128))
    playlists: Mapped[List[Playlist]] = db.relationship(secondary=playlist_track, back_populates="tracks")
