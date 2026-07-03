from collections.abc import Callable

from connexion import AsyncApp
from connexion.exceptions import BadRequestProblem
from connexion.resolver import Resolver

from app.api.controllers.cafe_controller import CafeController
from app.api.controllers.feedback_controller import FeedbackController
from app.config import load_settings
from app.db.database import build_session_factory
from app.errors import handle_bad_request
from app.repositories.cafe_repository import DEFAULT_CAFES, SqlAlchemyCafeRepository
from app.repositories.feedback_repository import SqlAlchemyFeedbackRepository
from app.services.cafe_service import CafePersistenceService
from app.services.feedback_service import FeedbackPersistenceService, FeedbackValidationService


def create_app() -> AsyncApp:
    feedback_controller, cafe_controller = build_controllers()
    api = AsyncApp(
        __name__,
        specification_dir="api",
    )
    api.add_api(
        "openapi.yaml",
        # Connexion reads operationId values and resolves them to these bound methods.
        resolver=Resolver(
            build_operation_map(feedback_controller, cafe_controller).__getitem__
        ),
        strict_validation=True,
        validate_responses=True,
    )
    api.add_error_handler(BadRequestProblem, handle_bad_request)
    return api


def build_controllers() -> tuple[FeedbackController, CafeController]:
    # Manual DI: wire dependencies once, then pass abstractions inward.
    settings = load_settings()
    session_factory = build_session_factory(settings)
    feedback_repository = SqlAlchemyFeedbackRepository(session_factory)
    cafe_repository = SqlAlchemyCafeRepository(session_factory)
    validation_service = FeedbackValidationService()
    feedback_persistence_service = FeedbackPersistenceService(feedback_repository)
    cafe_persistence_service = CafePersistenceService(cafe_repository)
    cafe_persistence_service.seed_cafes(DEFAULT_CAFES)
    return (
        FeedbackController(
            validation_service,
            feedback_persistence_service,
            cafe_persistence_service,
        ),
        CafeController(cafe_persistence_service),
    )


def build_operation_map(
    feedback_controller: FeedbackController,
    cafe_controller: CafeController,
) -> dict[str, Callable[..., object]]:
    # Keep OpenAPI operationIds stable without module globals or framework magic.
    return {
        "app.api.controllers.feedback_controller.create_feedback": (
            feedback_controller.create_feedback
        ),
        "app.api.controllers.feedback_controller.list_feedback": (
            feedback_controller.list_feedback
        ),
        "app.api.controllers.cafe_controller.list_cafes": cafe_controller.list_cafes,
    }
