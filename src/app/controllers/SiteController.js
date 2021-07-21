const Event = require('../models/Event');
const Product = require('../models/Product');
const { mutipleMongooseToObject } = require('../../tools/mongoose');

class SiteController {
    index(req, res, next) {
        Event.find({})
            .then((events) => {
                events=  mutipleMongooseToObject(events);
                Product.find({discount: {$gt: 0}}).limit(6).sort({discount: 'desc'})
                .then((discountPro) =>{
                    discountPro = mutipleMongooseToObject(discountPro);
                    res.render('home',{events,discountPro});
                })
                .catch(next);
            })
            .catch(next);
    }
}

module.exports = new SiteController();
