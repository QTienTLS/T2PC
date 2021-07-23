const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/ProductController');

router.get('/all', productController.showAll);
router.get('/:id/detail', productController.showDetail);
router.get('/:type/list/', productController.showByType);
router.get('/submenu/:menu', productController.showSubmenu);
router.get('/:type/list/sort/:method', productController.showSortPro);

module.exports = router;
