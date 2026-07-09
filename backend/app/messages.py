import time
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from .auth import require_admin
from .db import Message, get_db

router = APIRouter(prefix="/messages", tags=["messages"])

# ponytail: rate limit em memória por IP (5/hora); trocar por slowapi/Redis
# se o backend passar a correr com múltiplos workers.
RATE_LIMIT = 5
RATE_WINDOW = 3600.0
_hits: dict[str, list[float]] = {}


def check_rate_limit(request: Request) -> None:
    ip = request.client.host if request.client else "unknown"
    now = time.monotonic()
    hits = [t for t in _hits.get(ip, []) if now - t < RATE_WINDOW]
    if len(hits) >= RATE_LIMIT:
        raise HTTPException(429, "Demasiados pedidos. Tente novamente mais tarde.")
    hits.append(now)
    _hits[ip] = hits


class MessageIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    company: str = Field(default="", max_length=255)
    phone: str = Field(default="", max_length=64)
    service: str = Field(default="", max_length=255)
    message: str = Field(min_length=1, max_length=10_000)


class MessageOut(MessageIn):
    id: int
    read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


@router.post(
    "",
    response_model=MessageOut,
    status_code=201,
    dependencies=[Depends(check_rate_limit)],
)
def create_message(data: MessageIn, db: Session = Depends(get_db)):
    msg = Message(**data.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("", response_model=list[MessageOut], dependencies=[Depends(require_admin)])
def list_messages(read: bool | None = None, db: Session = Depends(get_db)):
    q = db.query(Message).order_by(Message.created_at.desc())
    if read is not None:
        q = q.filter(Message.read == read)
    return q.all()


@router.patch("/{message_id}/read", response_model=MessageOut, dependencies=[Depends(require_admin)])
def mark_read(message_id: int, db: Session = Depends(get_db)):
    msg = db.get(Message, message_id)
    if msg is None:
        raise HTTPException(404, "Mensagem não encontrada")
    msg.read = True
    db.commit()
    db.refresh(msg)
    return msg
