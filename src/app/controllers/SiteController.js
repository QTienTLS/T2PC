const Event = require('../models/Event');
const { mutipleMongooseToObject } = require('../../tools/mongoose');

class SiteController {
    index(req, res, next) {
        Event.find({})
            .then((events) => {
                res.render('home', { events: mutipleMongooseToObject(events) });
            })
            .catch(next);
    }
    deleteCart(req, res) {
        req.session.Cart = null;
        res.redirect('back');
    }
}

module.exports = new SiteController();
