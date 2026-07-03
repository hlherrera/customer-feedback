# Add Seeded Cafes To Feedback Flow

## Summary
Add a relational `CafeModel` with seeded cafes, require each feedback submission to reference a cafe, expose cafes through the API for the frontend dropdown, and return embedded cafe details with feedback responses.

## Key Changes
- Backend model layer:
  - Add `CafeModel` with `id`, `name`, and `description`.
  - Add `Feedback.cafe_id` as a non-null foreign key to `CafeModel.id`.
  - Add a one-to-many relationship: one cafe has many feedback records.
- Backend persistence/service/controller:
  - Add `cafe_repository.py` with list/get/seed-missing behavior.
  - Add `CafePersistenceService` to seed default cafes and list/get cafes.
  - Seed `McDonald's`, `BK`, and `KFC` during app wiring in `main.py`, after `create_all`.
  - Keep `FeedbackRepository` responsible for feedback persistence, but return feedback rows with embedded cafe data.
  - Update `FeedbackController` to validate `cafe_id`, confirm the cafe exists, and return `400 application/problem+json` with `Cafe must be one of the available cafes.` for unknown IDs.
- Public API/OpenAPI:
  - Add `GET /cafes`, returning `[{ id, name, description }]`.
  - Update `POST /feedback` request body to require `cafe_id`.
  - Update feedback create/list responses to include `cafe_id` and embedded `cafe: { id, name, description }`.
  - Update examples, validation field labels, Bruno request body, and README contract notes.
- Frontend:
  - Add `Cafe` type and `cafe_id` to draft/payload types.
  - Add `listCafes()` in `feedbackApi.ts`.
  - Load cafes on app startup and pass them into `FeedbackForm`.
  - Add a required cafe dropdown above Email, populated from the API.
  - Disable cafe selection while loading and disable submit if cafes are unavailable.
  - Show selected cafe name in recent feedback using the embedded response data.

## Test Plan
- Backend API tests:
  - `GET /api/cafes` returns seeded cafes in stable order.
  - Seeding is idempotent when app setup runs more than once against the same DB.
  - `POST /api/feedback` requires `cafe_id`.
  - Valid feedback with a seeded `cafe_id` persists and returns embedded cafe data.
  - Invalid/nonexistent `cafe_id` returns `400` with the agreed problem detail.
  - `GET /api/feedback` includes cafe data for stored feedback.
- Frontend tests:
  - Validation accepts a complete draft with `cafe_id`.
  - Validation rejects missing cafe selection.
  - `FeedbackForm` renders the cafe dropdown above Email and uses provided cafe options.
  - `FeedbackList` displays the cafe name.
  - Update affected snapshots intentionally.
- Verification commands:
  - Backend: `cd backend && uv run pytest && uv run ruff check .`
  - Frontend: `cd frontend-spa && corepack pnpm typecheck && corepack pnpm test:ci && corepack pnpm build`

## Assumptions
- No migration framework will be added. Fresh DBs/tests work through `Base.metadata.create_all`; existing local `backend/feedback.db` should be recreated because `create_all()` will not alter the existing `feedback` table.
- Requests send `cafe_id`; responses include both `cafe_id` and embedded `cafe`.
- The initial seed descriptions can be short, static display text for the three named cafes.
