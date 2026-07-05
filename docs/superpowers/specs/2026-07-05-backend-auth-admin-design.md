# Onono — Backend, Auth & Painel de Mensagens

Data: 2026-07-05 · Aprovado pelo utilizador em conversa.

## Objetivo

1. Upgrade do frontend para Next.js 16 (latest) + React 19 estável.
2. Backend FastAPI + PostgreSQL (Docker local).
3. Cadastro e login: email+password **e** "Entrar com Google".
4. Formulário "Envie-nos uma Mensagem" grava na base de dados; painel `/admin` (só admin) lista as mensagens.

## Arquitetura

FastAPI é a autoridade única de auth. O botão Google (Google Identity Services)
devolve um ID token no cliente → `POST /auth/google` → FastAPI verifica com as
chaves públicas da Google → cria/liga o utilizador → emite JWT próprio.
Email+password usa o mesmo JWT (HS256, `Authorization: Bearer`).

## Backend (`backend/`)

Stack: FastAPI, SQLAlchemy 2 (sync + psycopg), passlib[bcrypt], PyJWT,
google-auth. Sem Alembic (create_all no arranque). Postgres via
`docker-compose.yml` (só o serviço db; API corre com uvicorn).

### Tabelas

- `users`: id, email (unique), name, hashed_password (nullable), google_sub (nullable, unique), role (`user`/`admin`), created_at
- `messages`: id, name, email, company, phone, service, message, read (bool, default false), created_at

### Endpoints

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | /auth/register | — | email+password → JWT |
| POST | /auth/login | — | JWT |
| POST | /auth/google | — | ID token Google → JWT |
| GET | /auth/me | Bearer | dados do utilizador |
| POST | /messages | — | formulário de contacto |
| GET | /messages | admin | lista (query `read` opcional) |
| PATCH | /messages/{id}/read | admin | marca como lida |

Admin: quem se registar/logar com o email igual a `ADMIN_EMAIL` (env) fica `role=admin`.

Env (`backend/.env`): `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `ADMIN_EMAIL`, `CORS_ORIGINS`.

## Frontend

- Next.js 16 latest, React 19 estável, `@types/react` 19.
- Novas rotas: `/login`, `/cadastro`, `/admin` (estilo glass-card existente).
- `/admin`: lista de mensagens, filtro lidas/não lidas, marcar como lida; redirect para `/login` se não for admin.
- `ContactSection`: substitui `mailto:` por `POST /messages` (mantém animação de sucesso).
- JWT em `localStorage`, helper `src/lib/api.ts` para fetch com Bearer.
- Botão Google via script GIS com `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
- Link de login na navegação.

## Fora de escopo (YAGNI)

Recuperação de password, verificação de email, refresh tokens, Alembic,
paginação do painel, deploy.

## Setup Google (utilizador)

Criar OAuth Client ID (tipo Web) no Google Cloud Console com origem
`http://localhost:3000`; colar o Client ID em `backend/.env` e
`.env.local`. Passos detalhados entregues no fim da implementação.
