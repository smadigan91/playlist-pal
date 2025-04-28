from src.persistence.models import User
from src.persistence import user_helper
from src.spotify.models import User as SpotifyUser
from sqlalchemy import select

test_user = User(id="test_id", display_name="test_user", profile_image_url="test_image_url.com",
                profile_uri="spotify:profile/test_user")

def test_persist_user(db_session):
    db_session.add(test_user)
    db_session.commit()
    results = db_session.execute(select(User)).one_or_none()

    assert results is not None
    result: User = results[0]

    assert result.id == test_user.id

def test_persist_spotify_user(db_session):
    test_spotify_user = user_to_spotify_user(test_user)
    created_user = user_helper.create_user(test_spotify_user)
    retrieved_user = user_helper.get_user_by_spotify_id(test_spotify_user.id)
    assert created_user == retrieved_user

def user_to_spotify_user(user: User):
    spotify_user = SpotifyUser()
    spotify_user.id = user.id
    spotify_user.display_name = user.display_name
    spotify_user.profile_image_url = user.profile_image_url
    spotify_user.profile_uri = user.profile_uri
    return spotify_user