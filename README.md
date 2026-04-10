# Bookstore E-Commerce Platform

A full-featured online bookstore with catalog browsing, shopping cart, Stripe-powered checkout, user authentication, and a contact/publications section.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | Next.js 14, React 18, Tailwind CSS      |
| Backend  | Node.js, Express 4                      |
| Database | PostgreSQL + Prisma ORM                 |
| Payments | Stripe                                  |
| Auth     | JWT + Google OAuth (Passport.js)        |
| Email    | Nodemailer                              |

## Project Structure

```
bookstore-ecommerce/
├── client/          # Next.js frontend
│   ├── pages/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   └── styles/
├── server/          # Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   └── prisma/
└── .env.example
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (running locally or via Docker)

### 1. Install dependencies

```bash
npm install          # installs root, client, and server workspaces
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in at minimum:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Random secret for signing tokens |
| `STRIPE_SECRET_KEY` | Payments | Stripe secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Payments | From `stripe listen --forward-to ...` |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Email | Nodemailer SMTP credentials |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth | Google Cloud Console credentials |

Then create `client/.env.local` for the frontend:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Set up the database

```bash
cd server

# Create tables from the Prisma schema
npx prisma migrate dev --name init

# Seed the catalog with sample books and categories
npm run db:seed
```

> **Tip:** Run `npm run db:studio` to open Prisma Studio and inspect data at http://localhost:5555.

### 4. Start development servers

```bash
cd ..          # back to repo root
npm run dev    # starts Next.js (port 3000) and Express (port 5000) together
```

The frontend runs at **http://localhost:3000** and the API at **http://localhost:5000**.

### 5. Run tests

```bash
cd server && npm test
```

Runs smoke tests for JWT auth middleware and the Stripe webhook handler (no database required).

### Stripe webhook testing locally

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward events to your local server:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the displayed `whsec_...` secret into `STRIPE_WEBHOOK_SECRET` in your `.env`.

## Task Reference

See [.tasks/MOHA-001.md](.tasks/MOHA-001.md) for the full implementation plan.
