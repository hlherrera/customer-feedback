import asyncio

from connexion.exceptions import BadRequestProblem

from app.services.cafe_service import CafePersistenceService
from app.services.feedback_service import FeedbackPersistenceService, FeedbackValidationService


class FeedbackController:
    def __init__(
        self,
        validation_service: FeedbackValidationService,
        persistence_service: FeedbackPersistenceService,
        cafe_persistence_service: CafePersistenceService,
    ) -> None:
        self._validation_service = validation_service
        self._persistence_service = persistence_service
        self._cafe_persistence_service = cafe_persistence_service

    async def create_feedback(self, body: dict):
        # Controller orchestrates: validate, persist, shape HTTP status.
        data = self._validation_service.validate_create(body)
        cafe = await asyncio.to_thread(
            self._cafe_persistence_service.get_cafe,
            data["cafe_id"],
        )
        if cafe is None:
            raise BadRequestProblem(detail="Cafe must be one of the available cafes.")
        # SQLAlchemy work is sync; to_thread keeps the async route responsive.
        created = await asyncio.to_thread(self._persistence_service.create_feedback, data)
        return created, 201, {"Content-Type": "application/json"}

    async def list_feedback(self):
        # Reads use the same async boundary as writes.
        return await asyncio.to_thread(self._persistence_service.list_feedback), 200
