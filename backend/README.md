# Customer Feedback API

Small backend. API first. Async Connexion. ORM DB. Manual DI.

Python note: Python has no official LTS label. This uses Python 3.13 for stable support and package fit.

## Local

```powershell
cd C:\Users\hlher\OneDrive\Documentos\customer-feedback\backend
uv venv --python 3.13
uv sync --group dev
copy .env.example .env
@"
APP_HOST=127.0.0.1
APP_PORT=8000
DATABASE_URL=sqlite+pysqlite:///./feedback.db
"@ | Set-Content .env
uv run python run.py
```

API: `http://127.0.0.1:8000/api/feedback`
Docs: `http://127.0.0.1:8000/api/ui/`

## Docker

Docker Desktop must be set to Linux containers for these images.
Copy `.env.example` to `.env` and set `SONAR_TOKEN` before running the quality
profile.

```powershell
docker compose up --build
```

API: `http://127.0.0.1:8000/api/feedback`

## Quality

```powershell
uv run ruff check .
uv run vulture
uv run pytest --cov=app --cov-report=xml
```

## Git Hooks

Install the repo hooks from the workspace root:

```powershell
cd C:\Users\hlher\OneDrive\Documentos\customer-feedback
uvx pre-commit install --hook-type pre-commit --hook-type pre-push
uvx pre-commit run --all-files
```

The hooks run backend Ruff checks and formatting before commit. Slower backend
checks, tests, and React frontend scripts run before push. Frontend hooks are
enabled automatically when `frontend-spa/package.json` defines `format`, `lint`,
`typecheck`, and `test:ci` scripts.

Run Sonar after server is up:

```powershell
uv run pytest --cov=app --cov-report=xml
docker compose --profile quality up -d sonarqube
$env:SONAR_TOKEN=(Get-Content .env | Where-Object { $_ -match '^SONAR_TOKEN=' } | ForEach-Object { $_.Split('=', 2)[1] })
$env:PYTHONIOENCODING="utf-8"
uv run pysonar --sonar-host-url http://127.0.0.1:9000 --sonar-token $env:SONAR_TOKEN --sonar-qualitygate-wait
```

Set the 90% coverage quality gate in SonarQube, then `--sonar-qualitygate-wait`
makes the analysis command fail when the gate fails.

SonarQube: `http://127.0.0.1:9000`

The Compose file uses the active `sonarqube:community` image. If Docker has an
older local image cached, refresh it with:

```powershell
docker compose --profile quality pull sonarqube
docker compose --profile quality up -d sonarqube
```

If you upgraded from the old `lts-community` image, the previous embedded H2
database may not be compatible. This project uses a fresh
`sonarqube_community_data` volume for the active Community image.

## DB Swap

Set `DATABASE_URL`.

Examples:

```text
sqlite+pysqlite:///./feedback.db
postgresql+psycopg://feedback:feedback@localhost:5432/feedback
mysql+pymysql://user:pass@localhost:3306/feedback
mssql+pyodbc://user:pass@host/db?driver=ODBC+Driver+18+for+SQL+Server
```
