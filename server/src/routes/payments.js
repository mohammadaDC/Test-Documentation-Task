const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/paymentsController');

router.post('/create-intent', ctrl.createPaymentIntent);
router.post('/webhook',       ctrl.handleWebhook);

module.exports = router;
