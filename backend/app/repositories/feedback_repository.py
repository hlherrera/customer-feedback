from typing import Protocol

from sqlalchemy import select

from app.db.database import SessionFactory
from app.db.models import Feedback

FeedbackData = dict[str, int | str]
FeedbackRow = dict[str, int | str]


class FeedbackRepository(Protocol):
    def add(self, data: FeedbackData) -> FeedbackRow:
        pass

    def list(self) -> list[FeedbackRow]:
        pass


class SqlAlchemyFeedbackRepository:
    def __init__(self, session_factory: SessionFactory) -> None:
        self._session_factory = session_factory

    def add(self, data: FeedbackData) -> FeedbackRow:
        with self._session_factory() as session:
            # One short transaction per write keeps DB access predictable.
            feedback = Feedback(**data)
            session.add(feedback)
            session.commit()
            session.refresh(feedback)
            return _to_row(feedback)

    def list(self) -> list[FeedbackRow]:
        with self._session_factory() as session:
            rows = session.scalars(select(Feedback).order_by(Feedback.id)).all()
            return [_to_row(row) for row in rows]


def _to_row(feedback: Feedback) -> FeedbackRow:
    # Return plain JSON-ready data so controllers do not know ORM details.
    return {
        "id": feedback.id,
        "email": feedback.email,
        "comment": feedback.comment,
        "rating": feedback.rating,
        "highlight": feedback.highlight,
        "created_at": feedback.created_at.isoformat(),
    }
