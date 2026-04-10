const jwt = require('jsonwebtoken');

// Set secret before requiring the middleware
process.env.JWT_SECRET = 'test_secret';

const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

describe('authMiddleware', () => {
  test('passes valid Bearer token and attaches user to req', () => {
    const payload = { id: 'user_1', email: 'a@b.com', role: 'CUSTOMER' };
    const token   = jwt.sign(payload, 'test_secret');
    const req     = { headers: { authorization: `Bearer ${token}` } };
    const res     = mockRes();
    const next    = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe('user_1');
    expect(req.user.email).toBe('a@b.com');
  });

  test('rejects request with no Authorization header', () => {
    const req  = { headers: {} };
    const res  = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });

  test('rejects request with malformed token', () => {
    const req  = { headers: { authorization: 'Bearer not.a.real.token' } };
    const res  = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('rejects token signed with wrong secret', () => {
    const token = jwt.sign({ id: 'x' }, 'wrong_secret');
    const req   = { headers: { authorization: `Bearer ${token}` } };
    const res   = mockRes();
    const next  = jest.fn();

    authMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('rejects expired token', () => {
    const token = jwt.sign({ id: 'x' }, 'test_secret', { expiresIn: -1 });
    const req   = { headers: { authorization: `Bearer ${token}` } };
    const res   = mockRes();
    const next  = jest.fn();

    authMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('adminOnly', () => {
  test('passes when user role is ADMIN', () => {
    const req  = { user: { role: 'ADMIN' } };
    const res  = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('rejects when user role is CUSTOMER', () => {
    const req  = { user: { role: 'CUSTOMER' } };
    const res  = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
