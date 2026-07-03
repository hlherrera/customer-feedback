# Backend Architecture Notes

## Purpose

The backend supports a compact customer feedback API for seeded cafes/stores. It
prioritizes API-first behavior, clear validation, persistence, and testability
over production infrastructure.

## Structure

```text
app/
  main.py                  app factory, manual dependency wiring, operation resolver
  config.py                environment-backed settings
  api/openapi.yaml         OpenAPI contract and validation source
  api/controllers/         async HTTP orchestration
  services/                focused business logic
  repositories/            SQLAlchemy persistence adapters
  db/                      ORM base, models, session factory
tests/                     API and validation tests
bruno/                     manual API integration flow
```

## Request Flow

1. Connexion validates requests and responses against `openapi.yaml`.
2. `main.py` maps stable `operationId` values to controller methods.
3. Controllers orchestrate request workflow and use `asyncio.to_thread` for sync DB work.
4. Services keep business operations small and repository-backed.
5. Repositories hide SQLAlchemy details and return JSON-ready rows.

## Validation

- OpenAPI/Connexion owns API boundary rules: required fields, unknown fields, email format, rating range, highlight enum, and response shape.
- Pydantic only normalizes the internal feedback create payload after API validation.
- Cafe existence is a business rule checked before feedback is persisted.
- Error detail rewriting is centralized in `app/errors.py`.

## Persistence

- SQLAlchemy ORM models are defined in `app/db/models.py`.
- `CafeModel` stores seeded cafes: `McDonald's`, `BK`, and `KFC`.
- `Feedback` stores the required `cafe_id` relationship and feedback fields.
- `Base.metadata.create_all()` creates tables for fresh databases.
- There is no migration framework; recreate local SQLite databases after schema changes.

## Design Rules

- Manual dependency injection only; no framework globals or DI package.
- Controllers orchestrate services; services do not orchestrate each other.
- Repositories hide ORM details from controllers.
- Keep sync SQLAlchemy behind the existing async controller boundary.
- Keep source files short, explicit, and boring.

## Quality

Use `uv` from `backend`:

```powershell
uv run pytest
uv run pytest --cov=app --cov-report=xml
uv run ruff check .
uv run pyrefly check
uv run vulture
```

SonarQube uses `sonar-project.properties` and the generated `coverage.xml`.
