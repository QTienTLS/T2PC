const express = require('express');
const router = express.Router();
const accountController = require('../app/controllers/AccountController');

router.get('/login', accountController.login);
router.get('/register', accountController.register);
router.post('/save', accountController.save);
router.post('/loging-in', accountController.logingin);
router.get('/log-out', accountController.logout);
router.get('/detail', accountController.detail);
router.put('/:id/change-avt', accountController.changeAvt);
router.put('/:id/update', accountController.updateAcc);
router.get('/checkout',accountController.checkout);

module.exports = router;
