from collections.abc import Callable

from connexion import AsyncApp
from connexion.exceptions import BadRequestProblem
from connexion.resolver import Resolver

from app.api.controllers.feedback_controller import FeedbackController
from app.config import load_settings
from app.db.database import build_session_factory
from app.errors import handle_bad_request
from app.repositories.feedback_repository import SqlAlchemyFeedbackRepository
from app.services.feedback_service import FeedbackPersistenceService, FeedbackValidationService


def create_app() -> AsyncApp:
    controller = build_feedback_controller()
    api = AsyncApp(
        __name__,
        specification_dir="api",
    )
    api.add_api(
        "openapi.yaml",
        # Connexion reads operationId values and resolves them to these bound methods.
        resolver=Resolver(build_operation_map(controller).__getitem__),
        strict_validation=True,
        validate_responses=True,
    )
    api.add_error_handler(BadRequestProblem, handle_bad_request)
    return api


def build_feedback_controller() -> FeedbackController:
    # Manual DI: wire dependencies once, then pass abstractions inward.
    settings = load_settings()
    session_factory = build_session_factory(settings)
    repository = SqlAlchemyFeedbackRepository(session_factory)
    validation_service = FeedbackValidationService()
    persistence_service = FeedbackPersistenceService(repository)
    return FeedbackController(validation_service, persistence_service)


def build_operation_map(controller: FeedbackController) -> dict[str, Callable[..., object]]:
    # Keep OpenAPI operationIds stable without module globals or framework magic.
    return {
        "app.api.controllers.feedback_controller.create_feedback": controller.create_feedback,
        "app.api.controllers.feedback_controller.list_feedback": controller.list_feedback,
    }
