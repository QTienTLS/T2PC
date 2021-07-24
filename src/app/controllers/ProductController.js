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

    async showDetail(req, res, next) {
        var pro = await Product.findOne({ _id: req.params.id });
        pro.views++;
        pro.save();
        pro = mongooseToObject(pro);
        var n = pro.spec.length;
        var proSpec = pro.spec[0];
        for (let i = 1; i < n; i++) proSpec = proSpec + '~' + pro.spec[i];
        var x = { sp: proSpec };
        res.render('product/detail', { pro, x });
    }
    showByType(req, res) {
        var protype = {
            value: req.params.type,
        };
        Product.find({ type: protype.value }, function (err, pros) {
            pros = mutipleMongooseToObject(pros);
            res.render('product/product-list', { pros, protype });
        });
    }
    showSortPro(req, res,next) {
        var protype = {
            value: req.params.type,
        };
        if(req.params.method == 'discount')
        Product.find({ type: protype.value })
        .sort({'discount': 'desc'})
        .then((pros)=>{
            pros = mutipleMongooseToObject(pros);
            res.render('product/product-list', { pros,protype });
        })
        .catch(next);
    }
    showSubmenu(req, res) {
        var link = 'product/' + req.params.menu;
        res.render(link);
    }
}

module.exports = new ProductController();
