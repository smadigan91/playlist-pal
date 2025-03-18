from contextlib import contextmanager
from typing import Any, Iterator

from flask_sqlalchemy import SQLAlchemy
from flask_sqlalchemy.session import Session
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.types import JSON


class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
db.Model.registry.update_type_annotation_map(
    {
        dict[str, Any]: JSON
    }
)
db_session: Session = db.session

@contextmanager
def get_session() -> Iterator[Session]:
    try:
        yield db_session
        db_session.commit()
    except:
        db_session.rollback()
        raise