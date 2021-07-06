const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/ProductController');

router.get('/all', productController.showAll);
router.post('/:id/addtocart', productController.addToCart);
router.get('/:id/detail', productController.showDetail);
router.put('/:route/update-cart',productController.updateCart);

module.exports = router;
