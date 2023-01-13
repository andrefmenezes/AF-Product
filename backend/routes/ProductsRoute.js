const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/ProductsController');
const Auth = require('../auth.service');

router.get('/', Auth.requireLogin, ProductsController.getAll);
router.get('/dashboard', Auth.requireLogin, ProductsController.getDash);
router.post('/', Auth.requireLogin, ProductsController.insert);
router.get('/:id', Auth.requireLogin, ProductsController.getById);
router.put('/edit/:id', Auth.requireLogin, ProductsController.edit);
router.put('/pay/:id', Auth.requireLogin, ProductsController.pay);
router.delete('/:id', Auth.requireLogin, ProductsController.removeById);

module.exports = router;
