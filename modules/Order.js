const mongoose = require('mongoose')
const { Schema } = mongoose;

// Skapar ett nytt schema för orders.
const orderSchema = new Schema({
    timeStamp: Date, 
    status: String,
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orderValue: Number
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;
