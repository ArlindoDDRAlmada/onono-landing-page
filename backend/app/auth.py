import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from pydantic import BaseModel, EmailStr
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .db import User, get_db

router = APIRouter(prefix="/auth", tags=["auth"])

JWT_SECRET = os.environ["JWT_SECRET"]
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "").lower()

bearer = HTTPBearer(auto_error=False)


# --- schemas ---

class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class GoogleIn(BaseModel):
    credential: str  # ID token do Google Identity Services


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    role: str

    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    user: UserOut


# --- helpers ---

def role_for(email: str) -> str:
    return "admin" if email.lower() == ADMIN_EMAIL else "user"


def make_token(user: User) -> TokenOut:
    payload = {
        "sub": str(user.id),
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if creds is None:
        raise HTTPException(401, "Não autenticado")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(401, "Token inválido ou expirado")
    user = db.get(User, int(payload["sub"]))
    if user is None:
        raise HTTPException(401, "Utilizador não existe")
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(403, "Acesso restrito a administradores")
    return user


# --- endpoints ---

@router.post("/register", response_model=TokenOut)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email.lower()).first():
        raise HTTPException(409, "Este email já está registado")
    if len(data.password) < 8:
        raise HTTPException(422, "A password deve ter pelo menos 8 caracteres")
    user = User(
        email=data.email.lower(),
        name=data.name.strip(),
        hashed_password=bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode(),
        role=role_for(data.email),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Este email já está registado")
    db.refresh(user)
    return make_token(user)


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if (
        user is None
        or user.hashed_password is None
        or not bcrypt.checkpw(data.password.encode(), user.hashed_password.encode())
    ):
        raise HTTPException(401, "Email ou password incorretos")
    return make_token(user)


@router.post("/google", response_model=TokenOut)
def google_login(data: GoogleIn, db: Session = Depends(get_db)):
    try:
        info = id_token.verify_oauth2_token(
            data.credential, google_requests.Request(), GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(401, "Token Google inválido")

    email = info["email"].lower()
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        user = User(
            email=email,
            name=info.get("name", email),
            google_sub=info["sub"],
            role=role_for(email),
        )
        db.add(user)
    elif user.google_sub is None:
        user.google_sub = info["sub"]  # liga conta existente ao Google
    db.commit()
    db.refresh(user)
    return make_token(user)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
