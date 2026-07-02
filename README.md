# Customer Feedback

Small customer feedback app for a local cafe. The React SPA runs in the browser,
validates the form, submits to the API, and the backend persists submissions to
a database.

The API requires `email`, `comment`, `rating`, and `highlight`. Invalid requests
return `application/problem+json` with a clear `detail` message. Email is checked
with a regex in the frontend, ratings are whole numbers from 1 to 5, and
highlights are limited to `Food`, `Coffee`, `Service`, or `Atmosphere`.

## Run Locally

Prerequisites:

- Python 3.13 and `uv`
- Node.js with Corepack enabled. This repo pins pnpm in
  `frontend-spa/package.json`.

If Corepack is not enabled yet:

```bash
corepack enable
corepack prepare pnpm@11.9.0 --activate
```

Start the API with local SQLite persistence:

```powershell
cd backend
uv venv --python 3.13
uv sync --group dev
cp .env.example .env
uv run python run.py
```

This creates `backend/feedback.db` and stores submissions there.

Start the frontend in another terminal:

```powershell
cd frontend-spa
corepack pnpm install
corepack pnpm dev
```

Frontend: `http://127.0.0.1:5173`
API: `http://127.0.0.1:8000/api/feedback`

To run the API with Postgres instead of SQLite:

```powershell
cd backend
copy .env.example .env
docker compose up --build
```

Then start the frontend with the same commands above. Vite proxies `/api` to the
local API.

## Quality Checks

Backend:

```bash
cd backend
uv run pytest
uv run ruff check .
```

Frontend:

```bash
cd frontend-spa
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test:ci
corepack pnpm build
```
