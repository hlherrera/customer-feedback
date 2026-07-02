import asyncio

from app.services.feedback_service import FeedbackPersistenceService, FeedbackValidationService


class FeedbackController:
    def __init__(
        self,
        validation_service: FeedbackValidationService,
        persistence_service: FeedbackPersistenceService,
    ) -> None:
        self._validation_service = validation_service
        self._persistence_service = persistence_service

    async def create_feedback(self, body: dict):
        # Controller orchestrates: validate, persist, shape HTTP status.
        data = self._validation_service.validate_create(body)
        # SQLAlchemy work is sync; to_thread keeps the async route responsive.
        created = await asyncio.to_thread(self._persistence_service.create_feedback, data)
        return created, 201, {"Content-Type": "application/json"}

    async def list_feedback(self):
        # Reads use the same async boundary as writes.
        return await asyncio.to_thread(self._persistence_service.list_feedback), 200
