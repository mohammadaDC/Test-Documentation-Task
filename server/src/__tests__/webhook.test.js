/**
 * Smoke tests for the Stripe webhook handler.
 * Prisma and Stripe are mocked — no DB or network needed.
 */

process.env.JWT_SECRET            = 'test_secret';
process.env.STRIPE_SECRET_KEY     = 'sk_test_fake';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fake';

// ── Mock Stripe ───────────────────────────────────────────────────────────────
const mockConstructEvent = jest.fn();
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: { constructEvent: mockConstructEvent },
    paymentIntents: { create: jest.fn() },
  }));
});

// ── Mock Prisma ───────────────────────────────────────────────────────────────
const mockOrderFindUnique = jest.fn();
const mockOrderCreate     = jest.fn();
const mockBookUpdate      = jest.fn();
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    order: { findUnique: mockOrderFindUnique, create: mockOrderCreate },
    book:  { findMany: jest.fn().mockResolvedValue([]), update: mockBookUpdate },
  })),
}));

const { handleWebhook } = require('../controllers/paymentsController');

function mockReq(overrides = {}) {
  return {
    headers: { 'stripe-signature': 'valid_sig', ...overrides.headers },
    body: Buffer.from('{}'),
    ...overrides,
  };
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  res.send   = jest.fn().mockReturnValue(res);
  return res;
}

beforeEach(() => jest.clearAllMocks());

describe('handleWebhook', () => {
  test('returns 500 when STRIPE_WEBHOOK_SECRET is not set', async () => {
    const saved = process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const res = mockRes();
    await handleWebhook(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    process.env.STRIPE_WEBHOOK_SECRET = saved;
  });

  test('returns 400 when stripe-signature header is missing', async () => {
    const res = mockRes();
    await handleWebhook(mockReq({ headers: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 400 when Stripe signature validation fails', async () => {
    mockConstructEvent.mockImplementationOnce(() => { throw new Error('Bad signature'); });

    const res = mockRes();
    await handleWebhook(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining('Bad signature'));
  });

  test('acknowledges unknown event types without creating an order', async () => {
    mockConstructEvent.mockReturnValueOnce({ type: 'charge.refunded', data: { object: {} } });

    const res = mockRes();
    await handleWebhook(mockReq(), res);

    expect(mockOrderCreate).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('skips duplicate order when payment intent already processed', async () => {
    mockConstructEvent.mockReturnValueOnce({
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_123', amount: 1000, metadata: { orderItems: '[]', shippingInfo: '{}' } } },
    });
    mockOrderFindUnique.mockResolvedValueOnce({ id: 'existing_order' });

    const res = mockRes();
    await handleWebhook(mockReq(), res);

    expect(mockOrderCreate).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('creates order on payment_intent.succeeded for new payment', async () => {
    const orderItems  = JSON.stringify([{ bookId: 'b1', quantity: 1, unitPrice: '9.99' }]);
    const shippingInfo = JSON.stringify({ name: 'Jane', email: 'j@e.com', address: '1 St', city: 'NY', zip: '10001', country: 'US' });

    mockConstructEvent.mockReturnValueOnce({
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_new', amount: 1099, metadata: { orderItems, shippingInfo } } },
    });
    mockOrderFindUnique.mockResolvedValueOnce(null);
    mockOrderCreate.mockResolvedValueOnce({ id: 'order_new' });
    mockBookUpdate.mockResolvedValue({});

    const res = mockRes();
    await handleWebhook(mockReq(), res);

    expect(mockOrderCreate).toHaveBeenCalledTimes(1);
    expect(mockBookUpdate).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'b1' } }));
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});
