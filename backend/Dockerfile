# ---------- Build Stage ----------
FROM python:3.11-slim AS builder

WORKDIR /app

COPY . .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir "."

# ---------- Runtime Stage ----------
FROM python:3.11-slim

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .

EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
