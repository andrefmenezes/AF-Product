const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const Auth = require('../auth.service');

router.get('/', Auth.requireLogin, CategoryController.getAll);
router.post('/', Auth.requireLogin, CategoryController.insert);
router.get('/:id', Auth.requireLogin, CategoryController.getById);
router.put('/edit/:id', Auth.requireLogin, CategoryController.edit);
router.delete('/:id', Auth.requireLogin, CategoryController.removeById);

module.exports = router;
