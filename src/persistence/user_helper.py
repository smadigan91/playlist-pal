from sqlalchemy import select
from typing import Optional

from .database import get_session
from .models import User
from ..spotify.models import User as SpotifyUser


def from_spotify_user(user: SpotifyUser):
    return User(id=user.id, display_name=user.display_name, profile_image_url=user.profile_image_url,
                   profile_uri=user.profile_uri)

def create_user(user: SpotifyUser) -> User:
    user = from_spotify_user(user)
    with get_session() as s:
        s.add(user)
    return user

def get_user_by_spotify_id(spotify_id: str) -> Optional[User]:
    with get_session() as s:
        result = s.execute(select(User).where(User.id == spotify_id)).one_or_none()
        if result:
            return result[0]
        return result



