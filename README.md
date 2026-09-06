# Mini Kanban Board

A full-stack collaborative Kanban workspace built with Next.js, React, TypeScript, Express, Prisma, and PostgreSQL.

## Live Demo

**Live application:** `https://your-deployment-url.example.com`

Replace the placeholder above with the deployed frontend URL when the application is published.

## Features

- Public landing page with light and dark themes
- JWT-based authentication with access and refresh tokens
- Protected dashboard and board routes
- Board creation, editing, and deletion
- Board sharing with `EDITOR` and `VIEWER` roles
- Member management for board owners
- Permission-aware board, column, and task operations
- Task creation, editing, deletion, reordering, and drag-and-drop movement
- Responsive dashboard and Kanban board layouts
- Searchable Share Board user selector
- Premium semantic light/dark UI using shadcn/ui and Tailwind CSS

## Tech Stack

### Frontend

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui and Base UI
- Motion
- Axios
- dnd-kit
- React Hook Form and Zod
- next-themes

### Backend

- Node.js 20+
- Express 5
- TypeScript
- Prisma 7
- PostgreSQL
- JWT authentication
- bcryptjs

## Project Structure

```text
.
├── backend/        Express API, Prisma schema, migrations, and authorization
├── frontend/       Next.js application and UI
├── package.json    Root development and build scripts
└── README.md
```

## Prerequisites

Install the following before starting:

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer, or a hosted PostgreSQL database
- Git

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Mini-Kanban-Board
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure the backend environment

Create `backend/.env` using this safe template:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/mini_kanban?schema=public"

JWT_ACCESS_SECRET="replace-with-a-long-random-access-secret"
JWT_REFRESH_SECRET="replace-with-a-long-random-refresh-secret"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

BCRYPT_SALT_ROUNDS=10
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:3000"
```

Do not commit `backend/.env`. Use unique, strong secrets outside local development.

### 4. Generate Prisma and apply migrations

From the `backend` directory:

```bash
npx prisma generate
npx prisma migrate dev
```

The database must be running and reachable through `DATABASE_URL` before applying migrations.

Optional database browser:

```bash
npx prisma studio
```

### 5. Configure the frontend environment

The frontend defaults to `http://localhost:5000/api/v1`. To override it, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

### 6. Start the application

Open two terminals from the repository root.

Terminal 1, backend:

```bash
npm run dev:backend
```

Terminal 2, frontend:

```bash
npm run dev:frontend
```

Open:

- Frontend: http://localhost:3000
- Backend health check: http://localhost:5000/

You can also start the frontend with:

```bash
npm run dev
```

## Root Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the frontend development server |
| `npm run dev:frontend` | Start the frontend development server |
| `npm run dev:backend` | Start the backend development server |
| `npm run build:frontend` | Build the frontend for production |
| `npm run build:backend` | Compile the backend TypeScript |

## Validation Commands

Frontend:

```bash
cd frontend
npm run typecheck
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm run build
```

The backend test script is not configured yet. `npm test` currently reports that no tests are specified.

## Authentication

The application uses the existing JWT flow:

- Login and registration return access and refresh tokens.
- The frontend stores the tokens in browser storage and attaches the access token as a Bearer token.
- The backend also supports authentication cookies.
- Protected routes use the existing client-side auth provider and route guards.
- Logout clears the existing authentication state and redirects to `/`.

## Application Routes

### Public routes

- `/` - Landing page
- `/login` - Login
- `/register` - Registration

### Protected routes

- `/dashboard` - Workspace overview
- `/dashboard/boards` - Owned boards
- `/dashboard/shared` - Boards shared with the current user
- `/boards/[boardId]` - Kanban board
- `/profile` - User profile
- `/settings` - Application settings

## Board Collaboration

Each board has an owner. Owners can share boards with registered users using the `EDITOR` or `VIEWER` role.

- `OWNER` can manage the board and its members.
- `EDITOR` can create, update, delete, and move columns and tasks.
- `VIEWER` can view the board but cannot mutate it.

The backend enforces board membership and permissions for board, column, task, and member operations. Knowing a board, column, or task ID does not grant access by itself.

The shared board API is:

```text
GET /api/v1/boards/shared
```

It returns only boards where the authenticated user is a non-owner `BoardMember`, including the current role and safe owner information.

## API Overview

Base URL:

```text
http://localhost:5000/api/v1
```

Authentication:

```text
POST /auth/register
POST /auth/login
GET  /auth/me
POST /auth/refresh-token
```

Boards:

```text
GET    /boards
GET    /boards/shared
POST   /boards
GET    /boards/:id
PATCH  /boards/:id
DELETE /boards/:id
```

Board members:

```text
GET    /boards/:boardId/members
POST   /boards/:boardId/members
PATCH  /boards/:boardId/members/:userId
DELETE /boards/:boardId/members/:userId
```

User search for sharing:

```text
GET /users/search?boardId=<boardId>&search=<query>&limit=5
```

Columns and tasks:

```text
GET    /boards/:boardId/columns
POST   /boards/:boardId/columns
PATCH  /boards/:boardId/columns/:columnId
DELETE /boards/:boardId/columns/:columnId

GET    /columns/:columnId/tasks
POST   /columns/:columnId/tasks
PATCH  /columns/:columnId/tasks/:taskId
DELETE /columns/:columnId/tasks/:taskId
PATCH  /columns/:columnId/tasks/:taskId/move
```

## Troubleshooting

### Frontend cannot reach the API

Confirm that the backend is running on port `5000` and that `frontend/.env.local` contains:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

### Prisma cannot connect

Check that PostgreSQL is running and that `DATABASE_URL` contains the correct host, port, database, username, password, and SSL options.

### Port 3000 is already in use

Stop the existing Next.js process or start the frontend on another port:

```bash
cd frontend
npm run dev -- --port 3001
```

If the frontend port changes, update the backend `FRONTEND_URL` value for CORS.

### Shared boards are empty

Verify that:

1. The recipient is registered and logged in.
2. A `BoardMember` record exists for the recipient and board.
3. The recipient is not the board owner.
4. The API request includes a valid access token.
5. `GET /api/v1/boards/shared` returns the expected board.

## Security Notes

- Never commit `.env` files or real secrets.
- Use strong, unique JWT secrets in deployed environments.
- Keep password fields out of user-facing API responses.
- Backend authorization is the source of truth for board collaboration.
