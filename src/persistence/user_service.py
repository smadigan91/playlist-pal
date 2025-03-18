from sqlalchemy import select

from .database import get_session
from .models import User
from ..spotify.models import User as SpotifyUser


def from_spotify_user(user: SpotifyUser):
    return User(id=user.id, display_name=user.display_name, profile_image_url=user.profile_image_url,
                   profile_uri=user.profile_uri)

def create_user(user: SpotifyUser):
    with get_session() as s:
        s.add(from_spotify_user(user))

def get_user_by_spotify_id(spotify_id: str):
    with get_session() as s:
        return s.execute(select(User).where(User.id == spotify_id)).one_or_none()



