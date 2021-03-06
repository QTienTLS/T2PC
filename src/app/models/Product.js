const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema(
    {
        name: { type: String, maxLength: 255, unique: true },
        img: { type: String, maxLength: 255 },
        type: { type: String, maxLength: 255 },
        brand: { type: String, maxLength: 255 },
        price: { type: Number },
        originPrice: { type: Number },
        discount: { type: Number },
        views: { type: Number, default: 0 },
        description: { type: String },
        desImg: { type: String },
        spec: [],
        stored: { type: Number },
        topseller: { type: Number, default: 0 },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Product', Product);
