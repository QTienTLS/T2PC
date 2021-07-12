const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema(
    {
        listProID: [],
        amount: [],
        userID: { type: String, required: true },
        nameReceiver: { type: String, required: true },
        status: { type: Number, default: 0 },
        userNote: { type: String },
        adminNote: { type: String },
        totalPrice: { type: Number },
        paymentMethod: { type: String, default: 'COD' },
        address: { type: String },
        phone: { type: Number },
        email: { type: String },

    },
    { timestamps: true },
);

module.exports = mongoose.model('Order', Order);
