const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const Auth = require('../auth.service');

router.get('/', Auth.requireLogin, UsersController.getAll);
router.post('/', UsersController.insert);
router.post('/auth', UsersController.auth);
router.delete('/auth', Auth.requireLogin, UsersController.removeAuth);

module.exports = router;
