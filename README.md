# LUMERAY – Smart Expense Tracker

![LUMERAY](https://img.shields.io/badge/LUMERAY-Smart%20Expense%20Tracker-blue) ![EXPENSE TRACKER](https://img.shields.io/badge/EXPENSE-TRACKER-green)

**Full-Stack Smart Expense Tracking Platform**

⭐ Star us on GitHub · 🐛 Report Bug · ✨ Request Feature

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Multi-Currency Support](#multi-currency-support)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

LUMERAY is a full-stack intelligent expense tracking platform designed to give users complete visibility into their financial habits. It supports secure JWT-based authentication, per-user expense isolation, multi-currency tracking, and real-time analytics via an interactive pie chart dashboard.

The platform is structured around two primary modes of interaction:

- **Dashboard Mode** – add, view, and delete expenses with real-time totals grouped by currency
- **Analytics Mode** – visualise spending patterns by category using interactive pie charts with mixed-currency awareness

---

## Key Features

- Secure user registration and login with bcrypt password hashing
- JWT-based authentication with token attached to every API request via Axios interceptor
- Complete expense isolation — each account only sees its own data
- Multi-currency support with per-expense currency selection (USD, INR, GBP, EUR, JPY, AED, and 9 more)
- Default currency preference saved in Settings and respected across the app
- Automatic pie chart with mixed-currency warning when expenses span multiple currencies
- Full transaction history with date, description, category, amount, and currency
- Delete expenses with optimistic UI — instant feedback with automatic revert on failure
- Analytics pie chart with mixed-currency warning when expenses span multiple currencies
- Profile editing with backend persistence — updated credentials work on next login
- Multi-step password toggle on login, register, and profile with eye icons
- Automatic state cache detection and clearing on login/logout for account isolation

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Axios | HTTP client with JWT interceptor |
| Recharts | Analytics pie chart |
| Framer Motion | Animations |
| date-fns | Date formatting |
| lucide-react | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API framework |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| pg | PostgreSQL database driver |
| dotenv | Environment config |

### Database

| Technology | Purpose |
|---|---|
| PostgreSQL (Supabase) | Persistent storage for users and expenses — free, hosted, 24/7 |

### Deployment

| Service | Purpose |
|---|---|
| Cloudflare Pages | Frontend hosting with auto-deploy on push |
| Render | Backend hosting |
| Supabase | PostgreSQL database (free tier, Mumbai region) |
| UptimeRobot | Keeps backend alive 24/7 by pinging every 5 minutes |

---

## System Architecture

- **Backend:** Express.js REST API in `backend/server.js` with route files in `backend/routes/`
- **Auth layer:** JWT middleware in both `routes/auth.js` and `routes/expenses.js`
- **Frontend:** React + TypeScript SPA in `src/` built with Vite
- **State management:** React Context — `AuthContext`, `ExpenseContext`, `CurrencyContext`

### Data Flow

1. User registers/logs in → backend returns signed JWT containing `user.id`
2. Auth layer decodes backend decoder JWT and sets `req.userId` to every request
3. Auth middleware on frontend verifies JWT — `AuthContext`, `ExpenseContext`
4. All expense queries filtered by `req.userId` → full per-user data isolation
5. Frontend caches expenses in `localStorage` and clears on login/logout

---

## Repository Structure

```
LUMERAY/
├── backend/                    # Node.js + Express backend
│   ├── routes/
│   │   ├── auth.js             # Signup and login routes
│   │   └── expenses.js         # GET, POST, DELETE expense routes
│   ├── db.js                   # PostgreSQL connection (Supabase via pg Pool)
│   ├── server.js               # Main server entry point
│   └── package.json            # Backend dependencies
├── src/                        # React + TypeScript frontend
│   ├── components/
│   │   ├── DashboardAgent.tsx  # Tracker, radar key, Tailwind modal
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.tsx     # Auth state, login, logout, updateUser
│   │   ├── TagsContext.tsx     # Expense DDO, cache management
│   │   └── CurrencyContext.tsx # Currency DDO + Default currency preference
│   ├── pages/
│   │   ├── Overview.tsx        # Public landing page
│   │   ├── Login.tsx           # Login page
│   │   ├── Register.tsx        # Register page
│   │   ├── Dashboard.tsx       # Dashboard with add expense form
│   │   ├── Transactions.tsx    # Full transaction table with delete button
│   │   ├── Analytics.tsx       # Pie chart grouped by category with multi-currency warning
│   │   └── Settings.tsx        # Default currency preference and profile edit
│   ├── api.ts                  # Axios instance
│   ├── App.tsx                 # React entry point
│   ├── main.tsx                # HTML entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.ts              # Vite build config
└── tailwind.config.js          # Tailwind config
```

---

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free) — recommended for hosted PostgreSQL
- A Cloudflare account for frontend hosting

---

## Quick Start

Clone and install both frontend and backend in a few commands:

```bash
git clone https://github.com/mdharishsuhaib/LUMERAY.git
cd LUMERAY
npm install
cd backend
npm install
```

Open:

- **Backend health:** `https://lumeray.onrender.com/`
- **Frontend:** `https://lumeray.mdharishsuhaib.workers.dev`

---

## Backend Setup

### Step 1: Configure Environment Variables

Inside the `backend/` folder, create a `.env` file:

```env
JWT_SECRET=your_jwt_secret
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_SUPABASE_HOST:5432/postgres
```

> ⚠️ Use the **Transaction Pooler URL** from Supabase for best compatibility on hosted platforms like Render:
> `postgresql://postgres.xxxx:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`

---

### Step 2: Create the Database Tables

Run the following SQL in your **Supabase SQL Editor** dashboard:

**Users table:**

```sql
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL UNIQUE,
  password VARCHAR(255) DEFAULT NULL
);
```

**Expenses table:**

```sql
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  amount FLOAT NOT NULL,
  category VARCHAR(100),
  description VARCHAR(255),
  date DATE,
  currency VARCHAR(10) DEFAULT 'USD',
  created_at VARCHAR(255) DEFAULT 'CURRENT_TIMESTAMP'
);
```

**Enable Row Level Security (RLS):**

```sql
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service" ON public.expenses
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all for service" ON public.users
FOR ALL USING (true) WITH CHECK (true);
```

---

### Step 3: Run the Backend

```bash
cd backend
node server.js
```

Backend will run on: `http://localhost:5000`

Health check:

```bash
curl http://localhost:5000/
```

Expected response:

```
LUMERAY Backend Running
```

---

## Frontend Setup

```bash
cd LUMERAY
npm install
npm run dev
```

Default URL: `http://localhost:5173`

Build for production:

```bash
npm run build
```

Output goes to `dist/`

---

## API Reference

Base URL: `https://lumeray.onrender.com/api`

All expense endpoints require `Authorization: Bearer <token>`

---

### 1) POST `/signup`

Register a new user.

**Request body:**
```json
{
  "name": "Mohammed Harish",
  "email": "harish@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Signup successful"
}
```

---

### 2) POST `/login`

Login and receive a JWT token.

**Request body:**
```json
{
  "email": "harish@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "name": "Mohammed Harish", "email": "harish@example.com" }
}
```

---

### 3) GET `/expenses`

Fetch all expenses for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 15,
    "amount": 700.00,
    "category": "Food",
    "description": "lunch at cafe",
    "date": "2026-03-14",
    "currency": "INR",
    "created_at": "2026-03-14 10:00:0002"
  }
]
```

---

### 4) POST `/expenses/add`

Add a new expense for the authenticated user.

**Request body:**
```json
{
  "amount": 700,
  "category": "Food",
  "description": "lunch at cafe",
  "date": "2026-03-29",
  "currency": "INR"
}
```

**Response:**
```json
{
  "message": "Expense added",
  "id": 1
}
```

---

### 5) DELETE `/expenses/:id`

Delete an expense by ID. Only deletes if it belongs to the authenticated user.

**Response:**
```json
{
  "message": "Expense deleted"
}
```

---

### 6) PUT `/user/update`

Update user profile (name, email, and optionally password).

**Request body:**
```json
{
  "name": "New Name",
  "email": "updated@example.com",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Profile updated",
  "user": { "name": "New Name", "email": "updated@example.com" }
}
```

---

## Frontend Pages

| Route | Description |
|---|---|
| `/` | Public landing page — lists features, how-to-use |
| `/login` | Login page with form validation |
| `/register` | Registration page with password strength validation |
| `/dashboard` | Overview — add expense form, total by currency, recent transactions |
| `/dashboard/transactions` | Full transaction table with delete button |
| `/dashboard/analytics` | Pie chart grouped by category with multi-currency warning |
| `/dashboard/settings` | Default currency preference and profile edit |

---

## Database Schema

### users

| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL | AUTO_INCREMENT, PRIMARY KEY |
| name | VARCHAR(255) | — |
| email | VARCHAR(255) | UNIQUE |
| password | VARCHAR(255) | bcrypt hashed |

### expenses

| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | AUTO_INCREMENT, PRIMARY KEY |
| user_id | INT | NOT NULL |
| amount | FLOAT | NOT NULL |
| category | VARCHAR(100) | — |
| description | VARCHAR(255) | — |
| date | DATE | — |
| currency | VARCHAR(10) | DEFAULT 'USD' |
| created_at | VARCHAR(255) | DEFAULT CURRENT_TIMESTAMP |

---

## Authentication Flow

1. User registers — password hashed with bcrypt (10 salt rounds) — stored in Supabase PostgreSQL
2. User logs in — bcrypt compares password — backend signs JWT with `{ id: user.id }`
3. JWT stored in `localStorage` on frontend
4. Axios interceptor reads token from `localStorage` and sets `Authorization: Bearer` header on every request
5. Backend middleware verifies JWT → extracts `req.userId` → all queries filtered by this ID
6. On logout → `localStorage` clears `token`, `user`, and `lumeray_expenses` to prevent data linkage between accounts

---

## Multi-Currency Support

LUMERAY supports 15 major world currencies:

| Code | Currency |
|---|---|
| USD | US Dollar |
| EUR | Euro |
| GBP | British Pound |
| INR | Indian Rupee |
| JPY | Japanese Yen |
| AED | UAE Dirham |
| AUD | Australian Dollar |
| CAD | Canadian Dollar |
| CHF | Swiss Franc |
| CNY | Chinese Yuan |
| SGD | Singapore Dollar |
| MYR | Malaysian Ringgit |
| SAR | Saudi Riyal |
| KRW | South Korean Won |
| BRL | Brazilian Real |

- Each expense stores its own currency at the time of creation
- The Dashboard groups totals by currency — totals for `INR` and `USD` etc. are never incorrectly added together
- The Analytics page shows a mixed-currency warning if expenses span multiple currencies
- Default currency is set in Settings and persisted in `localStorage`

---

## Troubleshooting

**Backend not responding / API request failed**

Render's free tier spins down after inactivity. Wait 30–60 seconds for it to wake up, then retry. UptimeRobot is configured to ping every 5 minutes to prevent this.

**Expenses showing from another account**

Clear `lumeray_expenses` from browser localStorage (F12 → Application → Local Storage → delete the key). This is handled automatically on login/logout in the latest version.

**Expense has no default value**

The `created_at` column is missing `AUTO_TIMESTAMP`. Fix with:

```sql
ALTER TABLE expenses MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

**Build fail on Cloudflare — "Missing script: build"**

The root `package.json` is missing or incorrect. Ensure `package.json` at the project root is the frontend one containing `"build": "vite build"`, not the backend one.

**`npm start` fails — look file out of sync**

Run `npm install` locally to regenerate `package-lock.json`, then commit and push.

**"No token provided" error**

The Axios interceptor in `src/api.ts` is missing. Ensure it reads `localStorage.getItem('token')` and sets the `Authorization` header.

---

## Future Improvements

- AI-based spending recommendations and smart financial insights
- Budget limits per category with overspend alerts
- Recurring expense scheduling
- Export transactions as CSV or PDF
- Live currency conversion using exchange rate API
- Dark mode support

---

## Author

**Mohammed Harish Suhaib M**

GitHub: [mdharishsuhaib](https://github.com/mdharishsuhaib)

---

## License

MIT License

Copyright (c) 2026 Mohammed Harish Suhaib M

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

> ⭐ If you found LUMERAY useful, please consider giving it a star on GitHub!
