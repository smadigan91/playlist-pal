from typing import List

"""
Simple classes wrapping responses from Spotify's web API for ease of use.
"""

class User:
    """
    Response from Spotify's Users API
    """
    def __init__(self, values: dict = None):
        values = values if values is not None else {}
        self.id: str = values.get("id")
        self.display_name: str = values.get("display_name")
        self.profile_image_url: str = values.get("images")[0].get("url") if values.get("images") else None
        self.profile_uri: str = values.get("uri")

class Track:
    """
    Response from Spotify's Tracks API
    """
    def __init__(self, values: dict = None):
        values = values if values is not None else {}
        self.artist = self.TrackArtist(values.get("artists")[0])
        self.album = self.TrackAlbum(values.get("album"))
        self.release_date = values.get("album")
        self.duration_ms: int = values.get("duration_ms")
        self.id: str = values.get("id", '')
        self.name: str = values.get("name", '')
        self.href: str = values.get("href", '')
        self.effective_name = self.name.lower() + self.artist.name.lower()

    def as_dict(self):
        return self.__dict__

    class TrackArtist:

        def __init__(self, values: dict = None):
            values = values if values is not None else {}
            self.href: str = values.get("href", '')
            self.id: str = values.get("id", '')
            self.name: str = values.get("name", '')
            self.type: str = values.get("type", '')
            self.uri: str = values.get("uri", '')

        def as_dict(self):
            return self.__dict__

    class TrackAlbum:

        def __init__(self, values: dict = None):
            values = values if values is not None else {}
            self.href: str = values.get("href", '')
            self.id: str = values.get("id", '')
            self.name: str = values.get("name", '')
            self.image_url: str = values.get("images", dict()).get("url")

        def as_dict(self):
            return self.__dict__


class Artist:
    """
    Response from Spotify's Artists API
    """
    def __init__(self, values: dict = None):
        values = values if values is not None else {}
        self.genres: List[str] = values.get("genres", [])
        self.href: str = values.get("href", '')
        self.id: str = values.get("id", '')
        self.images = self.ImageList(values=values.get("images"))
        self.name: str = values.get("name", '')
        self.popularity: int = values.get("popularity", 0)
        self.type: str = values.get("type", '')
        self.uri: str = values.get("uri", '')

    def as_dict(self):
        return self.__dict__

    class ImageList(list):

        def __init__(self, values: list = None):
            super().__init__()
            values = values if values is not None else []
            self[:] = [self.Image(value) for value in values]

        def as_dict(self):
            return self.__dict__

        class Image:

            def __init__(self, values: dict = None):
                values = values if values is not None else {}
                self.height: int = values.get("height", 0)
                self.url: str = values.get("url", '')
                self.width: int = values.get("width", 0)

            def as_dict(self):
                return self.__dict__


def extract_resource_id(resource_uri):
    resource_id = resource_uri
    if resource_id:
        if "open.spotify.com" in resource_uri:
            resource_id = resource_uri.split('/')[-1].split('?')[0]
        if 'spotify:' in resource_uri:
            resource_id = resource_uri.split(':')[2]
        if 'api.spotify.com' in resource_uri:
            resource_id = resource_uri.split('/')[-1]
    return resource_id
