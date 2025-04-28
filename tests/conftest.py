import pytest

from sqlalchemy.orm import sessionmaker
from src.persistence.database import db as _db
from src.app import create_app


@pytest.fixture(scope="session")
def app():
	app = create_app()
	yield app


@pytest.fixture(scope='session')
def app_ctx(app):
	with app.app_context():
		yield


@pytest.fixture(scope='session')
def db(app, app_ctx):
	yield _db
	_db.drop_all()


@pytest.fixture(scope='function')
def db_session(app, db, app_ctx):
	connection = db.engine.connect()
	transaction = connection.begin()

	session_factory = sessionmaker(bind=connection)
	session = session_factory()

	yield session

	transaction.rollback()
	connection.close()
	session.close()