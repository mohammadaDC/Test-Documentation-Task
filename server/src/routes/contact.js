const express  = require('express');
const router   = express.Router();
const { body, validationResult } = require('express-validator');
const ctrl     = require('../controllers/contactController');

// Reusable validation error handler
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map((e) => ({ field: e.path, message: e.msg })) });
  }
  next();
}

const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email address is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }).withMessage('Subject must be under 200 characters'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }).withMessage('Message must be under 5000 characters'),
];

const newsletterRules = [
  body('email').isEmail().normalizeEmail().withMessage('A valid email address is required'),
];

router.post('/',           contactRules,    validate, ctrl.sendMessage);
router.post('/newsletter', newsletterRules, validate, ctrl.subscribeNewsletter);

module.exports = router;
