FROM python:3.13-slim
WORKDIR /app

# Copy uv binaries
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Environment tuning
ENV UV_SYSTEM_PYTHON=1 \
    UV_LINK_MODE=copy \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

# System deps (for HTTPS)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install deps
RUN uv sync --frozen --no-dev --no-cache && rm -rf ~/.cache

# Copy application code
COPY . .

# Expose port
EXPOSE 8080

# Run app (matches backend/app/main.py)
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
