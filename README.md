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
- PostgreSQL 14+

### Installation

```bash
# Install all dependencies (root, client, server)
npm install

# Copy and fill in env vars
cp .env.example .env
# Also create client/.env.local with NEXT_PUBLIC_* variables

# Run database migrations and seed
cd server && npm run db:migrate && npm run db:seed

# Start both client and server in dev mode
cd .. && npm run dev
```

The frontend runs at **http://localhost:3000** and the API at **http://localhost:5000**.

## Task Reference

See [.tasks/MOHA-001.md](.tasks/MOHA-001.md) for the full implementation plan.
