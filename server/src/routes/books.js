const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/booksController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/',            ctrl.getBooks);
router.get('/categories',  ctrl.getCategories);
router.get('/:id',         ctrl.getBook);

// Admin-only mutations
router.post('/',     authMiddleware, adminOnly, ctrl.createBook);
router.put('/:id',   authMiddleware, adminOnly, ctrl.updateBook);
router.delete('/:id',authMiddleware, adminOnly, ctrl.deleteBook);

module.exports = router;
