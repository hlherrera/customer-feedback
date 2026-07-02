# Customer Feedback

Small customer feedback app for a local cafe. The backend stores submissions and the React frontend gives customers a simple browser form.

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

Start the API:

```bash
cd backend
uv venv --python 3.13
uv sync --group dev
cp .env.example .env
uv run python run.py
```

Start the frontend in another terminal:

```bash
cd frontend-spa
corepack pnpm install
corepack pnpm dev
```

Frontend: `http://127.0.0.1:5173`
API: `http://127.0.0.1:8000/api/feedback`

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
