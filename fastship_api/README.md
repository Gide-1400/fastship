# FastShip API (MVP)

## Quickstart

```bash
# Option A: Without venv (container/devbox)
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Option B: With venv (if available)
python3 -m venv .venv  # ensure python3-venv installed
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Open http://localhost:8000/docs for Swagger UI.

## Environment
- `DATABASE_URL` (default: `sqlite:///./fastship.db`)

## Structure
- `app/main.py` – FastAPI app entry
- `app/routers/*` – API routers
- `app/db/` – SQLAlchemy Base, Session
- `app/models/` – ORM models (TBD)
- `app/schemas/` – Pydantic schemas (TBD)
