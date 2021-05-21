const mongoose = require('mongoose')
const { Schema } = mongoose;

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
