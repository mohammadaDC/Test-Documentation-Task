const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/authController');
const passport = require('passport');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);
router.get('/me',        authMiddleware, ctrl.me);

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/login' }),
  ctrl.googleCallback
);

module.exports = router;
