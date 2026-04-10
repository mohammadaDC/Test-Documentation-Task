require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes    = require('./routes/auth');
const booksRoutes   = require('./routes/books');
const ordersRoutes  = require('./routes/orders');
const paymentsRoutes = require('./routes/payments');
const contactRoutes = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

// Security & logging middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Body parsing — stripe webhook needs raw body, mount before json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/books',    booksRoutes);
app.use('/api/orders',   ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/contact',  contactRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
