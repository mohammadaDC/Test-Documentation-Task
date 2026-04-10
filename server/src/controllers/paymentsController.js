const Stripe       = require('stripe');
const { PrismaClient } = require('@prisma/client');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

async function createPaymentIntent(req, res) {
  try {
    const { items, shipping } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Fetch book prices from DB to avoid client-side tampering
    const bookIds  = items.map((i) => i.id);
    const dbBooks  = await prisma.book.findMany({ where: { id: { in: bookIds } } });
    const bookMap  = Object.fromEntries(dbBooks.map((b) => [b.id, b]));

    let subtotalCents = 0;
    const lineItems   = [];

    for (const item of items) {
      const book = bookMap[item.id];
      if (!book) return res.status(400).json({ message: `Book ${item.id} not found` });
      if (book.stock < item.quantity) return res.status(400).json({ message: `"${book.title}" is out of stock` });
      const unitCents = Math.round(parseFloat(book.price) * 100);
      subtotalCents  += unitCents * item.quantity;
      lineItems.push({ bookId: book.id, quantity: item.quantity, unitPrice: book.price });
    }

    const shippingCents = subtotalCents >= 3000 ? 0 : 499;
    const taxCents      = Math.round(subtotalCents * 0.08);
    const totalCents    = subtotalCents + shippingCents + taxCents;

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   totalCents,
      currency: 'usd',
      metadata: { orderItems: JSON.stringify(lineItems), shippingInfo: JSON.stringify(shipping) },
    });

    res.json({ clientSecret: paymentIntent.client_secret, total: totalCents / 100 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi       = event.data.object;
    const items    = JSON.parse(pi.metadata.orderItems || '[]');
    const shipping = JSON.parse(pi.metadata.shippingInfo || '{}');

    await prisma.order.create({
      data: {
        status:                 'PAID',
        total:                  pi.amount / 100,
        shippingName:           shipping.name    || '',
        shippingEmail:          shipping.email   || '',
        shippingAddress:        shipping.address || '',
        shippingCity:           shipping.city    || '',
        shippingZip:            shipping.zip     || '',
        shippingCountry:        shipping.country || '',
        stripePaymentIntentId:  pi.id,
        items: {
          create: items.map((i) => ({
            bookId:    i.bookId,
            quantity:  i.quantity,
            unitPrice: i.unitPrice,
          })),
        },
      },
    });

    // Decrement stock
    for (const item of items) {
      await prisma.book.update({
        where: { id: item.bookId },
        data:  { stock: { decrement: item.quantity } },
      });
    }
  }

  res.json({ received: true });
}

module.exports = { createPaymentIntent, handleWebhook };
