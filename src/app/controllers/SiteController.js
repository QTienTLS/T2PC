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
                    Product.find({}).limit(6).sort({createdAt:'desc' })
                    .then((newPro) =>{
                        newPro = mutipleMongooseToObject(newPro);
                        res.render('home',{events,discountPro,newPro});
                    })
                    .catch(next);
                    
                })
                .catch(next);
            })
            .catch(next);
    }
}

module.exports = new SiteController();
