const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    user: {
        _id: Schema.Types.ObjectId,
        email: String,
        password: String, //hashed password
        name: String,
        role: String, // admin or customer
        adress: {
            street: String,
            zip: String,
            city: String
        },
        orderHistory: [{
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }]
    }
});

const User = mongoose.model('User', userSchema)

module.exports = User;
