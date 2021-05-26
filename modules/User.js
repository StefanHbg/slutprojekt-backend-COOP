const mongoose = require('mongoose')
const { Schema } = mongoose;

// Skapar ett nytt schema för användare.
const userSchema = new Schema({
    user: {
        _id: Schema.Types.ObjectId,
        email: {
            type: String,
            required: true
        },
        password: String,
        name: String,
        role: String, 
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
