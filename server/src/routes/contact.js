const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/contactController');

router.post('/',             ctrl.sendMessage);
router.post('/newsletter',   ctrl.subscribeNewsletter);

module.exports = router;
