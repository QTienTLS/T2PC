const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');

router.get('/', siteController.index);
router.get('/delete-cart', siteController.deleteCart);

module.exports = router;
