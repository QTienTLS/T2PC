const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/AdminController');

router.get('/', adminController.dashboard);
router.get('/event', adminController.event);
router.post('/event/add-event', adminController.addEvent);
router.delete('/event/:id', adminController.delEvent);
router.put('/event/:id', adminController.updateEvent);
router.get('/product', adminController.showProduct);
router.post('/addproduct', adminController.addFullProduct);
router.post('/addsproduct', adminController.addSemiProduct);
router.put('/product/del/:id', adminController.delPro);
router.put('/product/:op/:id', adminController.updatePro);
router.get('/order/:link', adminController.goToOrder);
router.put('/banuser/:id', adminController.banUser);
router.put('/update-order/:status/:id', adminController.updateOrder);
router.get('/find-topseller', adminController.findTopSeller);

module.exports = router;
