const express = require('express')
const { create } = require('../modules/Order')
const Order = require('../modules/Order')
const Product = require('../modules/Product')
const User = require('../modules/User')
const router = express.Router()

router.post('/', async (req, res) => {
    console.log(req.body);
    const user = await User.findOne({name: req.body.customer.name}) //dålig lösning. Vad händer om vi har 2 användare som har samma namn? Vi har inget id vi kan utgå ifrån. ID kommer endast i mongo. 

    const newOrder = new Order({
        timeStamp: Date.now(),
        status: 'inProcess',
        items: [req.body.items],
        orderValue: 123
    })
    newOrder.save((err) => {
        if (err) res.json(err)
        else {
            res.json(newOrder);
        }
    })
})

router.get('/', async (req, res) => {
    const orders = await Order.find({})
    res.send(orders)
})

module.exports = router