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

    showDetail(req, res, next) {
        Product.findOne({ _id: req.params.id }, function (err, pro) {
            if (err) console.log(err);
            pro = mongooseToObject(pro);
            pro.views++;
            var n = pro.spec.length;
            var proSpec = pro.spec[0];
            for (let i = 1; i < n; i++) proSpec = proSpec + '~' + pro.spec[i];
            var x = { sp: proSpec };
            // res.render('product/detail', { pro: mongooseToObject(pro) });
            Product.updateOne({ _id: req.params.id }, pro)
                .then(() => res.render('product/detail', { pro, x }))
                .catch(next);
        });
    }
    showByType(req,res){
        var protype = req.params.type;
        Product.find({type: protype},function(err,pros){
            pros = mutipleMongooseToObject(pros);
            res.render('product/product-list',{pros});
        })
    }
}

module.exports = new ProductController();
