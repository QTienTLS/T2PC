const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSold = new Schema(
    {
        proID: {type: String},
        sold: {type: Number},
        month: {type: Number},
        year: {type: Number},
    },
);

module.exports = mongoose.model('Product-Sold', ProductSold);
