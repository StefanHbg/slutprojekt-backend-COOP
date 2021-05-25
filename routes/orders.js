const express = require('express')
const { create } = require('../modules/Order')
const Order = require('../modules/Order')
const Product = require('../modules/Product')
const User = require('../modules/User')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    //console.log(req.body);
    //const user = await User.findOne({name: req.body.customer.name}) //dålig lösning. Vad händer om vi har 2 användare som har samma namn? Vi har inget id vi kan utgå ifrån. ID kommer endast i mongo. 

    let items = req.body.items;
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = await req.cookies['auth-token']
        jwt.verify(token, process.env.SECRET, async(err, payload) => {
            if (err) {
                console.log('inne i error');
                res.json(err)
            } else {
                console.log('inne i första elsen');
                if (payload.role == 'customer' && payload.role != 'admin') {     
                    console.log('inne i if');     
                    const user = await User.findOne({ "user.email": payload.email });
                    const products = await Product.find({ _id: { $in: items } });

                    const newOrder = new Order({
                        timeStamp: Date.now(),
                        status: 'inProcess',
                        items: items,
                        orderValue: products.reduce((total, prod) => total + prod.price, 0)
                    })
                    newOrder.save((err) => {
                        if (err) res.json(err)
                        else {
                            res.json(newOrder);
                        }
                    })
            } else {
                console.log('inne i else');
                res.json(err)
            }} 
        })
    }
})  

router.get('/', async (req, res) => {
    const orders = await Order.find({})
    res.send(orders)
})

module.exports = router