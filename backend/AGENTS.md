# Agent Guide

## Project Shape

This backend is API-first. `app/api/openapi.yaml` is the contract. Connexion loads it,
validates requests, validates responses, and maps each `operationId` to controller methods.

Keep backend source files short.

## Architecture

- `app/main.py`: application factory and manual dependency injection.
- `app/api/controllers`: async HTTP workflow orchestration.
- `app/services`: focused business logic units.
- `app/repositories`: DB ports/adapters.
- `app/db`: SQLAlchemy ORM setup and models.
- `tests`: API and validation tests.
- `bruno`: API integration flow.

Controller flow:

1. receive validated Connexion input
2. call cohesive service methods
3. run sync DB work with `asyncio.to_thread`
4. return plain JSON-ready data and HTTP status

## Patterns

- Manual DI only. No globals, no framework magic, no dependency-injection package.
- Controllers orchestrate workflow. Services do not call other services.
- Repositories hide ORM details. Controllers must not know SQLAlchemy models.
- OpenAPI handles API validation first: required fields, enum, range, length, response shape.
- Pydantic is only for small internal payload normalization.
- SQLAlchemy keeps DB vendor swapping behind `DATABASE_URL`.

## Connexion Rules

- Use `AsyncApp`.
- Set `strict_validation=True` and `validate_responses=True` in `add_api`.
- Keep `operationId` values stable.
- When an operation has multiple response media types, return explicit `Content-Type`.
- Prefer returning normal Python dict/list values; let Connexion serialize.

## Style

- All imports at top. No import inside functions to dodge cycles.
- No global mutable controller state.
- Comments should explain why a method exists or where a boundary is, not restate code.
- Keep 12-factor config in environment variables. No magic config in code.
- Keep code boring and obvious for take-home review.

## Quality Tools

Use `uv` for local dependency and command execution.

```bash
uv sync --group dev
uv run pytest
uv run ruff check .
uv run pyrefly check
uv run vulture
uv run pytest --cov=app --cov-report=xml
```

SonarQube runs from Docker Compose:

```bash
docker compose up sonarqube
sonar-scanner -Dsonar.host.url=http://127.0.0.1:9000 -Dsonar.token="$SONAR_TOKEN"
```

## Local Run

```bash
uv run python run.py
```

API: `http://127.0.0.1:8000/api/feedback`

Swagger UI: `http://127.0.0.1:8000/api/ui/`
