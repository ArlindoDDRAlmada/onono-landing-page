from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from .auth import require_admin
from .db import Message, get_db

router = APIRouter(prefix="/messages", tags=["messages"])


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


@router.post("", response_model=MessageOut, status_code=201)
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
