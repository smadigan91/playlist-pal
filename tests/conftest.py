import pytest
from sqlalchemy.orm import sessionmaker

from src.app import app
from src.persistence.database import db as _db


@pytest.fixture(scope="session")
def flask_app():
    yield app


@pytest.fixture(scope='session')
def app_ctx(flask_app):
    with flask_app.app_context():
        yield


@pytest.fixture(scope='session')
def db(flask_app, app_ctx):
    yield _db
    _db.drop_all()


@pytest.fixture(scope='function')
def db_session(flask_app, db, app_ctx):
    connection = db.engine.connect()
    transaction = connection.begin()

    session_factory = sessionmaker(bind=connection)
    session = session_factory()

    yield session

    transaction.rollback()
    connection.close()
    session.close()
