# QuickLeave

A full‑stack leave management system with Google OAuth via Supabase Auth, role-based access control, email notifications, and optional Google Calendar sync.

### Monorepo Layout
- `client/`: React + TypeScript + Vite frontend
- `server/`: Express + TypeScript backend

## Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase project (URL + keys)
- SMTP credentials (for email notifications)
- Google Cloud project with OAuth consent (for Calendar sync) – optional

### 1) Clone and install
```bash
# in repo root
npm install --prefix client
npm install --prefix server
```

### 2) Environment variables
Create `.env` files.

Server (`server/.env`):
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
EMAIL_FROM="QuickLeave <no-reply@yourdomain.com>"

# Google Calendar (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:5000/calendar/callback

# Frontend URL for OAuth redirects
FRONTEND_URL=http://localhost:5173
```

Client (`client/.env` or `.env.local`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3) Database schema (Supabase)
Create the following tables (names used by the backend):
- `users` (id uuid pk, email text, name text, role text in ['member','manager','admin'], created_at timestamp)
- `leave_types` (id uuid pk or bigint, name text)
- `leave_requests` (id uuid pk or bigint, user_id uuid fk->users.id, start_date date, end_date date, reason text, status text in ['pending','approved','rejected','cancelled'], leave_type_id fk->leave_types.id, google_event_id text nullable, created_at timestamp)
- `user_calendar_tokens` (id pk, user_id uuid unique, access_token text, refresh_token text, token_type text, expiry_date bigint/timestamp, created_at timestamp, updated_at timestamp)
- `leave_calendar_events` (id pk, leave_request_id fk->leave_requests.id, user_id uuid, google_event_id text, created_at timestamp)

Ensure RLS policies allow the service role to read/write as used by the backend.

### 4) Run locally
Terminal 1 (server):
```bash
npm run dev --prefix server
```
Terminal 2 (client):
```bash
npm run dev --prefix client
```
- API: http://localhost:5000
- Web: http://localhost:5173

## Tech Stack
- Frontend: React 19, React Router 7, Tailwind CSS 4, Vite 7, TypeScript 5
- Backend: Express 5 (ESM), TypeScript, tsx, Nodemon
- Auth/DB: Supabase (`@supabase/supabase-js`)
- Email: Nodemailer (SMTP)
- Calendar: Google Calendar API (`googleapis`)

## Authentication
The backend expects a Bearer token from Supabase Auth in `Authorization` header. `requireAuth` validates the token with Supabase and attaches `req.user`. Role checks query `users.role` via `requireRole([...])`.

## API Reference
Base URL: `http://localhost:5000`

- Health
  - `GET /` → QuickLeave API running
  - `GET /health` → `{ status, timestamp, uptime }`

- Users (`/users`)
  - `GET /users/me` (auth)
    - Response: `{ id, email, role, name }`
    - Auto-creates a `users` row with default role `member` if missing; pulls Google name.
  - `PATCH /users/:id/role` (auth + role: admin)
    - Body: `{ role: "manager" | "member" }`
    - Response: `{ message, user }`

- Admin (`/admin`)
  - `GET /admin/users` (auth + role: admin)
    - Response: `{ users: [{ id, email, role, name, created_at }] }`
  - `POST /admin/update-role` (auth + role: admin)
    - Body: `{ email: string, role: "manager" | "member" }`
    - Response: `{ success: true, message }`

- Leave (`/leave`)
  - `POST /leave` (auth + role: member|manager|admin)
    - Body: `{ start_date: string(YYYY-MM-DD), end_date: string(YYYY-MM-DD), reason: string, leave_type_id: string }`
    - Response: `{ success: true }`
  - `GET /leave/my` (auth + role: member|manager|admin)
    - Response: `{ leaves: [{ id, start_date, end_date, reason, status, created_at, leave_type_name }] }`
  - `GET /leave/all` (auth + role: manager|admin)
    - Response: `{ requests: [{ id, start_date, end_date, reason, status, created_at, user_name, user_email, leave_type_name }] }`
  - `PATCH /leave/:id/status` (auth + role: member|manager|admin)
    - Body: `{ status: "approved" | "rejected" | "cancelled" }`
    - Rules: only manager/admin can approve/reject; only owner can cancel.
    - Response: `{ success: true }`

- Leave Types (`/leave/types`)
  - `GET /leave/types` (auth any role)
    - Response: `[{ id, name }]`
  - `POST /leave/types` (auth + role: admin)
    - Body: `{ name: string }`
    - Response: `{ success: true }`
  - `DELETE /leave/types/:id` (auth + role: admin)
    - Response: `{ success: true }`

- Calendar (`/calendar`)
  - `DELETE /calendar/leave/:id` (auth)
    - Deletes a leave and removes linked Google Calendar event if present.
    - Response: `{ success: true }`
  - `GET /calendar/auth-url` (auth)
    - Response: `{ authUrl }` to initiate Google OAuth.
  - `GET /calendar/callback`
    - Handles Google OAuth redirect; stores tokens; redirects to `FRONTEND_URL` with status.
  - `GET /calendar/status` (auth)
    - Response: `{ isConnected: boolean }`
  - `DELETE /calendar/disconnect` (auth)
    - Disconnects current user’s Google Calendar. Response: `{ success: true, message }`
  - `DELETE /calendar/disconnect/:userId` (auth + role: admin|manager)
    - Force-disconnect a user’s calendar. Response: `{ success: true, message }`

### Headers
All authenticated routes require:
```
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

## Frontend
- Vite dev server: `npm run dev --prefix client` → `http://localhost:5173`
- Supabase client configured in `client/src/lib/supabaseClient.ts`
- Auth flow uses Supabase OAuth; server trusts Supabase JWT for API calls

## Deployment notes
- Set server env vars on your host (e.g., Vercel/Render/Fly/VM). Ensure `FRONTEND_URL` uses your production URL and Google OAuth redirect matches `GOOGLE_REDIRECT_URI`.
- Configure SMTP provider or Gmail App Passwords for reliable email delivery.

## License
ISC (see `server/package.json`).
