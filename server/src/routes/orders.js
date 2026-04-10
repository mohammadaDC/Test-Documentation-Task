const express = require('express');
const router  = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/authMiddleware');

const prisma = new PrismaClient();

// Get current user's orders
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where:   { userId: req.user.id },
      include: { items: { include: { book: { select: { id: true, title: true, coverImage: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where:   { id: req.params.id, userId: req.user.id },
      include: { items: { include: { book: true } } },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
