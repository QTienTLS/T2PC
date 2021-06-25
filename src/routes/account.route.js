const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/AccountController');

router.get('/login', accountController.login);
router.get('/register', accountController.register);
router.post('/save', accountController.save);
router.post('/loging-in',accountController.logingin);
router.get('/log-out',accountController.logout);

module.exports = router;
