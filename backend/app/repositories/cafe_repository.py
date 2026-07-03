from typing import Protocol

from sqlalchemy import select

from app.db.database import SessionFactory
from app.db.models import CafeModel

CafeData = dict[str, str]
CafeRow = dict[str, int | str]

DEFAULT_CAFES: tuple[CafeData, ...] = (
    {
        "name": "McDonald's",
        "description": "Quick-service cafe counter for familiar food and coffee stops.",
    },
    {
        "name": "BK",
        "description": "Casual burger cafe for quick meals and visit feedback.",
    },
    {
        "name": "KFC",
        "description": "Fast-service chicken cafe for meal and service feedback.",
    },
)


class CafeRepository(Protocol):
    def get(self, cafe_id: int) -> CafeRow | None:
        pass

    def list(self) -> list[CafeRow]:
        pass

    def seed_missing(self, cafes: tuple[CafeData, ...]) -> None:
        pass


class SqlAlchemyCafeRepository:
    def __init__(self, session_factory: SessionFactory) -> None:
        self._session_factory = session_factory

    def get(self, cafe_id: int) -> CafeRow | None:
        with self._session_factory() as session:
            cafe = session.get(CafeModel, cafe_id)
            return _to_row(cafe) if cafe else None

    def list(self) -> list[CafeRow]:
        with self._session_factory() as session:
            rows = session.scalars(select(CafeModel).order_by(CafeModel.id)).all()
            return [_to_row(row) for row in rows]

    def seed_missing(self, cafes: tuple[CafeData, ...]) -> None:
        with self._session_factory() as session:
            existing_names = set(session.scalars(select(CafeModel.name)).all())
            missing = [
                CafeModel(**cafe) for cafe in cafes if cafe["name"] not in existing_names
            ]
            if missing:
                session.add_all(missing)
                session.commit()


def _to_row(cafe: CafeModel) -> CafeRow:
    return {
        "id": cafe.id,
        "name": cafe.name,
        "description": cafe.description,
    }
