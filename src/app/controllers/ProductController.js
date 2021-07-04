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
    addToCart(req,res,next){
        Product.findOne({_id: req.params.id}, function(err,pro){
           if(err) res.send(err);
           if(!req.session.Cart)
           {
               req.session.Cart = {
                   product: [pro.name],
                   amount: [1],
                   numPro: 1
               }
             
           }
           else
           {
               var i;
               var isPush = true;
               for(i=0;i<req.session.Cart.product.length;i++)
               {
                   if(pro.name === req.session.Cart.product[i])
                   {
                    req.session.Cart.amount[i]++;

                    isPush = false;
                   }
               }
               if(isPush)
               {
                req.session.Cart.product.push(pro.name);
                req.session.Cart.amount.push(1);
                
               }
               req.session.Cart.numPro++;
           }
            console.log( req.session.Cart);
           res.redirect('back');
        })
    }
    showDetail(req, res, next) {
        Product.findOne({ _id: req.params.id }, function (err, pro) {
            if (err) console.log(err);
            res.render('product/detail', { pro: mongooseToObject(pro) });
        })
    }
}

module.exports = new ProductController();
