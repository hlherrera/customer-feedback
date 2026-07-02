from collections.abc import Callable

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import NullPool

from app.config import Settings
from app.db.models import Base

SessionFactory = Callable[[], Session]


def build_session_factory(settings: Settings) -> sessionmaker[Session]:
    if settings.database_url.startswith("sqlite"):
        engine = create_engine(settings.database_url, poolclass=NullPool)
    else:
        engine = create_engine(settings.database_url, pool_pre_ping=True)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, expire_on_commit=False)
