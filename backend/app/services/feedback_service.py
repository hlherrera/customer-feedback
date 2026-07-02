from typing import Any, cast

from pydantic import BaseModel, ConfigDict

from app.repositories.feedback_repository import FeedbackData, FeedbackRepository, FeedbackRow


class FeedbackCreateModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    email: str
    comment: str
    rating: int
    highlight: str


class FeedbackValidationService:
    def validate_create(self, payload: dict[str, Any] | None) -> FeedbackData:
        # OpenAPI handles API constraints; Pydantic normalizes the internal shape.
        model = FeedbackCreateModel.model_validate(payload or {})
        return cast(FeedbackData, model.model_dump())


class FeedbackPersistenceService:
    def __init__(self, repository: FeedbackRepository) -> None:
        self._repository = repository

    def create_feedback(self, data: FeedbackData) -> FeedbackRow:
        # Business operation stays small and repository-backed.
        return self._repository.add(data)

    def list_feedback(self) -> list[FeedbackRow]:
        return self._repository.list()
