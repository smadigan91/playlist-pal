import os

import redis


def get_required(env_var_name):
    val = os.environ.get(env_var_name)
    if not val:
        raise RuntimeError(f"Required environment variable {env_var_name} is not defined")
    return val


BASE_URL = os.environ.get('BASE_URL', 'http://localhost:8080')

# spotify

SPOTIFY_CLIENT_ID = get_required('SPOTIFY_CLIENT_ID')

SPOTIFY_CLIENT_SECRET = get_required('SPOTIFY_CLIENT_SECRET')

SESSION_KEY = get_required('SESSION_KEY')

# postgres

DB_USER = get_required('DB_USER')

DB_PASSWORD = get_required('DB_PASSWORD')

DB_HOST = get_required('DB_HOST')

DB_PORT = get_required('DB_PORT')

DB_NAME = get_required('DB_NAME')

SQLALCHEMY_DATABASE_URI = \
    'postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}'.format(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        db=DB_NAME
)

# redis

REDIS_URL = os.environ.get('REDIS_URL')

REDIS_HOST = os.environ.get('REDIS_HOST')

REDIS_PORT = os.environ.get('REDIS_PORT')

redis_connection = None

def get_redis_connection():
    global redis_connection
    if redis_connection is None:
        if REDIS_PORT and REDIS_HOST:
            redis_connection = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, retry_on_timeout=True,
                                                 socket_timeout=10, socket_connect_timeout=1)
        elif REDIS_URL:
            redis_connection = redis.StrictRedis.from_url(url=REDIS_URL, retry_on_timeout=True, socket_timeout=10,
                                                          socket_connect_timeout=1)
        else:
            raise RuntimeError("REDIS_URL or (REDIS_HOST and REDIS_PORT) must be defined")
    return redis_connection
