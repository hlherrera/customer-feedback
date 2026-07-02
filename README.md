# Customer Feedback

Small customer feedback app for a local cafe. The backend stores submissions and the React frontend gives customers a simple browser form.

## Run Locally

Start the API:

```powershell
cd backend
uv venv --python 3.13
uv sync --group dev
copy .env.example .env
uv run python run.py
```

Start the frontend in another terminal:

```powershell
cd frontend-spa
npm install
npm run dev
```

Frontend: `http://127.0.0.1:5173`
API: `http://127.0.0.1:8000/api/feedback`

## Quality Checks

Backend:

```powershell
cd backend
uv run pytest
uv run ruff check .
```

Frontend:

```powershell
cd frontend-spa
npm run lint
npm run typecheck
npm run test:ci
```
