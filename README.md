# LUMERAY – Smart Expense Tracker

<div align="center">

![LUMERAY](https://img.shields.io/badge/LUMERAY-Smart%20Expense%20Tracker-4f46e5?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEzIDIuMDVWMTFoOC45NUExMCAxMCAwIDAgMCAxMyAyLjA1ek0xMSAyLjA1QTEwIDEwIDAgMCAwIDIuMDUgMTFIMTFWMi4wNXpNMi4wNSAxM0ExMCAxMCAwIDAgMCAxMSAyMS45NVYxM0gyLjA1ek0xMyAxMy4wNXY4LjlBMTAgMTAgMCAwIDAgMjEuOTUgMTNIMTN6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==)

**Full-Stack Smart Expense Tracking Platform**

[![GitHub stars](https://img.shields.io/github/stars/mdharishsuhaib/LUMERAY?style=social)](https://github.com/mdharishsuhaib/LUMERAY/stargazers)
[![GitHub watchers](https://img.shields.io/github/watchers/mdharishsuhaib/LUMERAY?style=social)](https://github.com/mdharishsuhaib/LUMERAY/watchers)
[![GitHub forks](https://img.shields.io/github/forks/mdharishsuhaib/LUMERAY?style=social)](https://github.com/mdharishsuhaib/LUMERAY/forks)

</div>

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
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Multi-Currency Support](#multi-currency-support)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

LUMERAY is a full-stack intelligent expense tracking platform designed to give users complete visibility into their financial habits. It supports secure JWT-based authentication, per-user expense isolation, multi-currency tracking, and real-time analytics via an interactive pie chart dashboard.

The platform is structured around two primary modes of interaction:

- `Dashboard Mode` : add, view, and delete expenses with real-time totals grouped by currency.
- `Analytics Mode` : visualise spending patterns by category using interactive pie charts with mixed-currency awareness.

---

## Key Features

- Secure user registration and login with bcrypt password hashing.
- JWT-based authentication with token attached to every API request via Axios interceptors.
- Per-user expense isolation — each account only sees its own data.
- Multi-currency support with per-expense currency selection (`USD`, `EUR`, `GBP`, `INR`, `JPY`, `AED`, and 9 more).
- Default currency preference saved in Settings and respected across the app.
- Expense dashboard with total grouped by currency — no incorrect cross-currency addition.
- Full transaction history with date, description, category, amount, and currency.
- Delete expenses with optimistic UI — instant feedback with automatic revert on failure.
- Analytics pie chart with mixed-currency warning when expenses span multiple currencies.
- Profile editing with backend persistence — updated credentials work on next login.
- Show/hide password toggle on login, register, and profile edit screens.
- Responsive design — works on mobile, tablet, and desktop.
- Automatic stale cache detection and clearing on login/logout for account isolation.

---

## Tech Stack

**Frontend**

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Axios | HTTP client with JWT interceptor |
| Vite | Build tool |
| Recharts | Analytics pie chart |
| Framer Motion | Animations |
| date-fns | Date formatting |
| lucide-react | Icons |

**Backend**

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js 5 | REST API framework |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| mysql2 | Database driver |
| dotenv | Environment config |

**Database**

| Technology | Purpose |
|---|---|
| MySQL (Railway) | Persistent storage for users and expenses |

**Deployment**

| Service | Purpose |
|---|---|
| Cloudflare Pages | Frontend hosting with auto-deploy on push |
| Render | Backend hosting |
| Railway | MySQL database |

---

## System Architecture

- Backend: `Express.js` REST API in `backend/server.js` with route files in `backend/routes/`.
- Auth layer: JWT middleware in both `server.js` and `routes/expenses.js`.
- Frontend: React + TypeScript SPA in `src/` built with Vite.
- State management: React Context — `AuthContext`, `ExpenseContext`, `CurrencyContext`.
- Data flow:

1. User registers/logs in → backend returns signed JWT containing `user.id`.
2. Axios interceptor attaches `Authorization: Bearer <token>` to every request.
3. Auth middleware on backend decodes JWT and sets `req.userId`.
4. All expense queries filter by `req.userId` — full per-user isolation.
5. Frontend caches expenses in `localStorage` and clears on login/logout.

---

## Repository Structure

```
LUMERAY/
├── backend/                        # Node.js + Express backend
│   ├── routes/
│   │   ├── auth.js                 # Signup and login routes
│   │   └── expenses.js             # GET, POST, DELETE expense routes
│   ├── db.js                       # MySQL connection
│   ├── server.js                   # Main server entry point
│   └── package.json                # Backend dependencies
├── src/                            # React + TypeScript frontend
│   ├── components/
│   │   ├── DashboardLayout.tsx     # Sidebar, mobile nav, logout modal
│   │   └── Navbar.tsx              # Public landing page navbar
│   ├── context/
│   │   ├── AuthContext.tsx         # Auth state, login, logout, updateUser
│   │   ├── ExpenseContext.tsx      # Expense CRUD, cache management
│   │   └── CurrencyContext.tsx     # Default currency preference
│   ├── pages/
│   │   ├── Home.tsx                # Public landing page
│   │   ├── Login.tsx               # Login page
│   │   ├── Register.tsx            # Registration page
│   │   └── dashboard/
│   │       ├── Overview.tsx        # Dashboard with add expense form
│   │       ├── Transactions.tsx    # Full transaction table with delete
│   │       ├── Analytics.tsx       # Pie chart analytics
│   │       └── Settings.tsx        # Profile and currency settings
│   ├── api.ts                      # Axios instance with JWT interceptor
│   ├── types.ts                    # TypeScript interfaces
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Tailwind base styles
├── index.html                      # HTML entry point
├── wrangler.toml                   # Cloudflare Pages config
├── vite.config.ts                  # Vite build config
├── tailwind.config.js              # Tailwind config
└── README.md
```

---

## Prerequisites

- Node.js 18+ and npm.
- A MySQL database (Railway recommended for free hosted MySQL).
- A Render account for backend hosting.
- A Cloudflare account for frontend hosting.

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

- Backend health: `https://lumeray.onrender.com/`
- Frontend: `https://lumeray.mdharishsuhaib.workers.dev`

---

## Backend Setup

### Step 1: Configure Environment Variables

Inside the `backend/` folder, create a `.env` file:

```env
DB_HOST=your_railway_host
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway
DB_PORT=your_port
JWT_SECRET=your_secret_key
PORT=5000
```

### Step 2: Create the Database Tables

Run the following SQL in your Railway MySQL dashboard:

**Users table:**
```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);
```

**Expenses table:**
```sql
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  description VARCHAR(255),
  date DATE,
  currency VARCHAR(10) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

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
🚀 LUMERAY Backend Running
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

Output goes to `dist/`.

---

## API Reference

Base URL: `https://lumeray.onrender.com/api`

All expense endpoints require `Authorization: Bearer <token>` header.

---

### 1) POST `/signup`

Register a new user.

Request body:

```json
{
  "name": "Mohammed Haris",
  "email": "haris@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Signup successful"
}
```

---

### 2) POST `/login`

Login and receive a JWT token.

Request body:

```json
{
  "email": "haris@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Mohammed Haris",
    "email": "haris@example.com"
  }
}
```

---

### 3) GET `/expenses`

Fetch all expenses for the authenticated user.

Response:

```json
[
  {
    "id": 1,
    "user_id": 3,
    "amount": 500.00,
    "category": "Food",
    "description": "Lunch at cafe",
    "date": "2026-03-19",
    "currency": "INR",
    "created_at": "2026-03-19T10:30:00.000Z"
  }
]
```

---

### 4) POST `/expenses/add`

Add a new expense for the authenticated user.

Request body:

```json
{
  "amount": 500,
  "category": "Food",
  "description": "Lunch at cafe",
  "date": "2026-03-19",
  "currency": "INR"
}
```

Response:

```json
{
  "message": "Expense added",
  "id": 1
}
```

---

### 5) DELETE `/expenses/:id`

Delete an expense by ID. Only deletes if it belongs to the authenticated user.

Response:

```json
{
  "message": "Expense deleted"
}
```

---

### 6) PUT `/user/update`

Update user profile (name, email, and optionally password).

Request body:

```json
{
  "name": "New Name",
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

Response:

```json
{
  "message": "Profile updated",
  "user": {
    "name": "New Name",
    "email": "newemail@example.com"
  }
}
```

---

## Frontend Pages

| Route | Description |
|---|---|
| `/` | Public landing page — hero, features, how-to-use |
| `/login` | Login page with email/password validation |
| `/register` | Registration page with password strength validation |
| `/dashboard` | Overview — add expense form, total by currency, recent transactions |
| `/dashboard/transactions` | Full transaction table with delete button |
| `/dashboard/analytics` | Pie chart grouped by category with multi-currency warning |
| `/dashboard/settings` | Default currency preference and profile edit |

---

## Database Schema

### `users`

| Column | Type | Constraints |
|---|---|---|
| `id` | INT | AUTO_INCREMENT, PRIMARY KEY |
| `name` | VARCHAR(100) | — |
| `email` | VARCHAR(100) | UNIQUE |
| `password` | VARCHAR(255) | bcrypt hashed |

### `expenses`

| Column | Type | Constraints |
|---|---|---|
| `id` | INT | AUTO_INCREMENT, PRIMARY KEY |
| `user_id` | INT | NOT NULL |
| `amount` | DECIMAL(10,2) | NOT NULL |
| `category` | VARCHAR(100) | — |
| `description` | VARCHAR(255) | — |
| `date` | DATE | — |
| `currency` | VARCHAR(10) | DEFAULT 'USD' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Authentication Flow

1. User registers → password hashed with `bcrypt` (10 salt rounds) → stored in MySQL.
2. User logs in → bcrypt compares password → backend signs JWT with `{ id: user.id }`.
3. JWT stored in `localStorage` on frontend.
4. Axios interceptor reads token from `localStorage` and sets `Authorization: Bearer <token>` on every request.
5. Backend middleware verifies JWT → extracts `req.userId` → all queries filter by this ID.
6. On logout → `localStorage` clears `token`, `user`, and `lumeray_expenses` to prevent data leakage between accounts.

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

- Each expense stores its own currency at the time of creation.
- The Dashboard groups totals by currency — `₹500.00 INR` and `$200.00 USD` are never incorrectly added together.
- The Analytics page shows a mixed-currency warning if expenses span multiple currencies.
- Default currency is set in Settings and persisted in `localStorage`.

---

## Troubleshooting

**Backend not responding / API request failed**

Render's free tier spins down after inactivity. Wait 30–60 seconds for it to wake up, then retry.

**Expenses showing from another account**

Clear `lumeray_expenses` from browser localStorage: F12 → Application → Local Storage → delete the key. This is handled automatically on login/logout in the latest version.

**Field 'id' doesn't have a default value**

The `expenses` table `id` column is missing `AUTO_INCREMENT`. Fix with:
```sql
ALTER TABLE expenses MODIFY id INT AUTO_INCREMENT;
```

**Build fails on Cloudflare — "Missing script: build"**

The root `package.json` is missing or incorrect. Ensure `package.json` at the project root is the frontend one (containing `"build": "vite build"`), not the backend one.

**npm ci fails — lock file out of sync**

Run `npm install` locally to regenerate `package-lock.json`, then commit and push.

**"No token provided" error**

The Axios interceptor in `src/api.ts` is missing. Ensure it reads `localStorage.getItem('token')` and sets the `Authorization` header.

---

## Future Improvements

- AI-based spending recommendations and smart financial insights.
- Budget limits per category with overspend alerts.
- Recurring expense scheduling.
- Export transactions as CSV or PDF.
- Live currency conversion using exchange rate API.
- Dark mode support.

---

## Author

**Mohammed Haris Suhaib M**

GitHub: [mdharishsuhaib](https://github.com/mdharishsuhaib)

---

## License

MIT License

Copyright (c) 2026 Mohammed Haris Suhaib M

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

⭐ If you found LUMERAY useful, please consider giving it a star on GitHub!
