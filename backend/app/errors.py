import json
import re
from typing import Any

from connexion.exceptions import BadRequestProblem, ProblemException
from connexion.lifecycle import ConnexionRequest, ConnexionResponse

FIELD_LABELS = {
    "comment": "Comment",
    "email": "Email",
    "highlight": "Visit highlight",
    "rating": "Rating",
}


def handle_bad_request(
    _request: ConnexionRequest,
    exception: Exception,
) -> ConnexionResponse:
    if not isinstance(exception, BadRequestProblem):
        raise exception
    return _problem_response(exception, _clear_bad_request_detail(exception.detail))


def _problem_response(exception: ProblemException, detail: str | None) -> ConnexionResponse:
    body: dict[str, Any] = {
        "type": exception.type or "about:blank",
        "title": exception.title,
        "detail": detail or "The request could not be processed.",
        "status": exception.status,
    }
    body.update(exception.ext or {})
    return ConnexionResponse(
        status_code=exception.status,
        content_type="application/problem+json",
        body=json.dumps(body),
    )


def _clear_bad_request_detail(detail: str | None) -> str:
    if not detail:
        return "The request body is invalid."

    missing = re.search(r"'([^']+)' is a required property", detail)
    if missing:
        return f"{_label(missing.group(1))} is required."

    unexpected = re.search(r"\('([^']+)' was unexpected\)", detail)
    if unexpected:
        return f"Unexpected field: {unexpected.group(1)}."

    field = re.search(r" - '([^']+)'$", detail)
    field_name = field.group(1) if field else ""

    if field_name == "email":
        return "Email must be a valid email address."
    if field_name == "comment":
        return "Comment is required."
    if field_name == "rating":
        return "Rating must be a whole number between 1 and 5."
    if field_name == "highlight":
        return "Visit highlight must be Food, Coffee, Service, or Atmosphere."

    return detail


def _label(field_name: str) -> str:
    return FIELD_LABELS.get(field_name, field_name)
