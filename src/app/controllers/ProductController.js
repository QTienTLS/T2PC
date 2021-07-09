const { mongooseToObject } = require('../../tools/mongoose');
const { mutipleMongooseToObject } = require('../../tools/mongoose');
const Product = require('../models/Product');

class ProductController {
    showAll(req, res, next) {
        Product.find({})
            .then((products) => {
                res.render('product/show-all', {
                    products: mutipleMongooseToObject(products),
                });
            })
            .catch(next);
    }
    addToCart(req, res, next) {
        Product.findOne({ _id: req.params.id }, function (err, pro) {
            if (err) res.send(err);
            if (!req.session.Cart) {
                req.session.Cart = {
                    product: [pro.name],
                    amount: [1],
                    numPro: 1,
                    numRow: 1,
                    price: [pro.price],
                    img: [pro.img],
                    totalPrice: pro.price,
                };
            } else {
                var i;
                var isPush = true;
                for (i = 0; i < req.session.Cart.product.length; i++) {
                    if (pro.name === req.session.Cart.product[i]) {
                        req.session.Cart.amount[i]++;
                        isPush = false;
                    }
                }
                if (isPush) {
                    req.session.Cart.product.push(pro.name);
                    req.session.Cart.price.push(pro.price);
                    req.session.Cart.img.push(pro.img);
                    req.session.Cart.amount.push(1);
                    req.session.Cart.numRow++;
                }
                req.session.Cart.numPro++;
                req.session.Cart.totalPrice += pro.price;
            }

            res.redirect('back');
        });
    }
    showDetail(req, res, next) {
        Product.findOne({ _id: req.params.id }, function (err, pro) {
            if (err) console.log(err);
            pro =  mongooseToObject(pro);
            pro.views++;
            // res.render('product/detail', { pro: mongooseToObject(pro) });
            Product.updateOne({ _id: req.params.id }, pro)
            .then(() => res.render('product/detail',{pro}))
            .catch(next);
        });
    }
    updateCart(req, res) {
        req.session.Cart = {
            product: req.body.product.split(','),
            amount : req.body.amount.split(',').map((x) => +x),
            numPro: parseInt(req.body.numPro),
            numRow: parseInt(req.body.numRow),
            price: req.body.price.split(',').map((x) => +x),
            img: req.body.img.split(','),
            totalPrice: parseInt(req.body.totalPrice),
        }
        if(req.params.route == 'back')
            res.redirect('back');
        else 
            res.redirect('/account/checkout');
        //res.json(req.session.Cart );
    }
}

module.exports = new ProductController();
