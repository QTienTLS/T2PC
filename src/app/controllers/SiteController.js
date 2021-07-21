const Event = require('../models/Event');
const Product = require('../models/Product');
const ProductSold = require('../models/ProductSold');
const { mutipleMongooseToObject } = require('../../tools/mongoose');
const { mongooseToObject } = require('../../tools/mongoose');

class SiteController {
    async index(req, res, next) {
        var events = await Event.find({});
        events = mutipleMongooseToObject(events);
        var discountPro = await Product.find({ discount: { $gt: 0 } })
            .limit(6)
            .sort({ discount: 'desc' });
        discountPro = mutipleMongooseToObject(discountPro);
        var newPro = await Product.find({})
            .limit(6)
            .sort({ createdAt: 'desc' });
        newPro = mutipleMongooseToObject(newPro);
        var topSellerPro = await Product.find({topseller: 1});
        topSellerPro = mutipleMongooseToObject(topSellerPro);
        res.render('home', { events, discountPro, newPro, topSellerPro });
    }
}

module.exports = new SiteController();
