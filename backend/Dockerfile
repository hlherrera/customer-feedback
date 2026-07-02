ARG PYTHON_VERSION=3.13-slim
FROM python:${PYTHON_VERSION}

WORKDIR /app
ENV APP_HOST=0.0.0.0 \
    APP_PORT=8000 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY pyproject.toml README.md ./
RUN pip install --no-cache-dir .

COPY app ./app
COPY run.py .

EXPOSE 8000
CMD ["python", "run.py"]
