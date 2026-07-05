import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import auth, messages
from .db import Base, engine

Base.metadata.create_all(engine)  # ponytail: create_all em vez de Alembic; migra quando o schema evoluir

app = FastAPI(title="Onono API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(messages.router)


@app.get("/health")
def health():
    return {"status": "ok"}
