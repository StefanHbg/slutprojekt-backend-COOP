const mongoose = require('mongoose')
const { Schema } = mongoose;

const orderSchema = new Schema({
    timeStamp: Date, 
    status: String,
    items: [],
    orderValue: Number
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;
